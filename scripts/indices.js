import site from "../src/data/site.js";

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
