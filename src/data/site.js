import { getSiteUrl } from "../../site-config.js";

// todo: translate these strings (en / en-US here)
const title = "The Language of Letting Go";

export default {
  title,
  description: "Daily Meditations on Codependency",
  notFound: "Meditation not found",
  skipToMain: "Skip to main content",
  primaryNav: "Primary navigation",
  meditationNav: "Meditation navigation",

  seeAll: "See all",
  about: "About",
  aboutTitle: `About ${title}`,
  aboutDescription: `About this digital companion to ${title} by Melody Beattie`,

  meditationsIndex: "Meditations index",
  meditationsIndexDescription: `Alphabetical index of meditations from ${title}`,
  indexNav: "Index navigation",
  navJump: "Jump to a letter section",
  navNoIndexEntry: (letter) => `No meditations indexed under ${letter}`,

  // used in index generation
  excludedTitlePrefixes: [
    'The',
  ],

  listSeparator: ",",

  url: getSiteUrl(),
};
