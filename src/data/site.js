import { getSiteUrl } from "../../site-config.js";

// todo: translate these strings (en / en-US here)
const title = "The Language of Letting Go";

export default {
  title,
  description: "Daily Meditations on Codependency",
  notFound: "Meditation not found",
  skipToMain: "Skip to main content",
  primaryNav: "Primary navigation",

  seeAll: "See all",
  meditationsIndex: "Meditations index",
  meditationsIndexDescription: `Alphabetical index of meditations from ${title}`,
  indexNav: "Index navigation",
  navJump: "Jump to a letter section",
  navNoIndexEntry: (letter) => `No meditations indexed under ${letter}`,

  listSeparator: ",",

  url: getSiteUrl(),
};
