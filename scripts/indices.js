import site from "../src/data/site.js";
import { stripFrontMatter, toPlainText } from "./utils.js";

// returns an array of meditations grouped and sorted alphabetically
export function meditationIndex(collection) {
  const entries = collection
    // get a list of meditation entries
    .filter((page) => !page.data.excludeFromMeditation)
    .map(({ fileSlug, url, data }) => {
      console.assert(typeof data.title === "string" && data.title.length > 0 && typeof data.displayDate === "string" && data.displayDate.length > 0, `Meditation ${fileSlug} is missing a title and/or display date`);
      if (typeof data.title !== "string" || data.title.length <= 0 || typeof data.displayDate !== "string" || data.displayDate.length <= 0) {
        throw new Error(`Meditation ${fileSlug} is missing a title and/or display date`);
      }

      let title = data.title.trim();
      for (const prefix of site.excludedTitlePrefixes) {
        if (title.startsWith(prefix)) {
          title = title.slice(prefix.length).trim();
          break;
        }
      }


      return {
        url,
        title,
        indices: Array.isArray(data.indices) ? data.indices.map((index) => index.trim()).filter(Boolean) : [],
        displayDate: data.displayDate.trim(),
        fileSlug,
      };
    })
    // merge (flatten) the secondary indices (`indices`) in to the array
    .flatMap((entry) => [entry.title, ...entry.indices].map((title) => ({
      url: entry.url,
      title,
      displayDate: entry.displayDate,
      fileSlug: entry.fileSlug,
    })))
    // sort by title, then by the date of the meditation (if there are multiple entries with the same title)
    .sort((a, b) => {
      const titleComparison = a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      if (titleComparison !== 0) {
        return titleComparison;
      }

      return a.fileSlug.localeCompare(b.fileSlug, undefined, { sensitivity: "base" });
    });

  // group the entries by title (there are multiple meditations with the same title, we want one title to multiple entries)
  const entriesByTitle = [];
  for (const entry of entries) {
    const currentEntry = entriesByTitle[entriesByTitle.length - 1];

    if (currentEntry && currentEntry.title.localeCompare(entry.title, undefined, { sensitivity: "base" }) === 0) {
      currentEntry.dates.push({
        displayDate: entry.displayDate,
        url: entry.url
      });
      continue;
    }

    entriesByTitle.push({
      title: entry.title,
      dates: [{
        displayDate: entry.displayDate,
        url: entry.url
      }]
    });
  }

  // group the entries by first letter for the index
  const groups = [];
  for (const entry of entriesByTitle) {
    const letter = entry.title[0].toUpperCase();
    const currentGroup = groups[groups.length - 1];
    if (!currentGroup || currentGroup.letter !== letter) {
      groups.push({
        letter,
        entries: [entry]
      });

      continue;
    }

    currentGroup.entries.push(entry);
  }

  return groups;
};

function getItemSource(item) {
  const rawInput = typeof item.data?.page?.rawInput === "string" ? item.data.page.rawInput : "";
  return stripFrontMatter(rawInput);
}

function shouldIncludeInSearch(item) {
  const pageUrl = item.url || "";
  const { data = {} } = item;

  if (!pageUrl || !pageUrl.endsWith("/")) {
    return false;
  }

  if (pageUrl === "/index/" || pageUrl === "/404.html") {
    return false;
  }

  if (data.excludeFromSearch || data.excludeFromSitemap || data.eleventyExcludeFromCollections) {
    return false;
  }

  return true;
}

export function buildSearchDocuments(collectionsAll = []) {
  return collectionsAll
    .filter(shouldIncludeInSearch)
    .map((item) => {
      const content = toPlainText(getItemSource(item));
      const title = item.data?.title || "";
      const description = item.data?.description || "";

      return {
        id: item.url,
        url: item.url,
        title,
        description,
        displayDate: item.data?.displayDate || "",
        content
      };
    })
    .filter((doc) => doc.title && doc.content);
}
