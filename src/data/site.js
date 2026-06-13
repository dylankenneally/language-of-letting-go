import { getSiteUrl } from "../../site-config.js";

// todo: translate these strings (en / en-US here)
const title = "The Language of Letting Go";
const description = "Daily Meditations on Codependency";

export default {
  title,
  shortTitle: "Language of Letting Go",
  description,
  notFound: "Meditation not found",
  skipToMain: "Skip to main content",
  primaryNav: "Primary navigation",
  meditationNav: "Meditation navigation",
  indexNav: "Index navigation",
  calendarNav: "Pick a Date",
  adjacentNav: "Adjacent meditations",

  nextDate: (date) => `Next meditation: ${date}`,
  prevDate: (date) => `Previous meditation: ${date}`,

  home: "Home",
  seeAll: "Index",
  about: `About`,
  aboutTitle: description,
  aboutDescription: `About this digital companion to ${title} by Melody Beattie`,

  search: "Search",
  searchTitle: `Find ${description}`,
  searchDescription: `Search all meditations and site pages`,
  searchNoResults: "No results found.",
  searchResultCount: (count) => `${count} result${count === 1 ? "" : "s"}`,

  meditationsIndex: "Meditations index",
  meditationsIndexDescription: `Alphabetical index of meditations from ${title}`,
  navJump: "Jump to a letter section",
  navNoIndexEntry: (letter) => `No meditations indexed under ${letter}`,

  // used in index generation
  excludedTitlePrefixes: [
    'The',
  ],

  listSeparator: ",",

  url: getSiteUrl(),

  externalUrls: {
    gitHub: 'https://github.com/dylankenneally/language-of-letting-go',
    amazon: 'https://www.amazon.com.au/Language-Letting-Meditation-Meditations-Codependents/dp/0894866370',
  },
};
