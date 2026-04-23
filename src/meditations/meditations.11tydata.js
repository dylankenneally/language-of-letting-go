import { formatDate } from "../meditation-date.js";

export default {
  tags: ["meditation"],
  layout: "meditation.njk",
  permalink: ({ page }) => `/${formatDate(page.fileSlug)}/index.html`
};
