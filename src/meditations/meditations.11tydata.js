import { formatDate } from "../../scripts/meditation-date.js";
import { stripFrontMatter, toPlainText } from "../../scripts/utils.js";

function truncateText(input, maxLength = 160) {
  if (input.length <= maxLength) {
    return input;
  }

  return `${input.slice(0, maxLength - 1).trimEnd()}…`;
}

export default {
  tags: ["meditation"],
  layout: "meditation.njk",
  permalink: ({ page }) => `/${formatDate(page.fileSlug)}/index.html`,
  eleventyComputed: {
    description: (data) => {
      const renderedContent = typeof data.content === "string" ? data.content : "";
      const markdownSource = data?.page?.rawInput ? stripFrontMatter(data.page.rawInput) : "";
      const source = renderedContent || markdownSource;
      const plainText = toPlainText(source);
      return plainText ? truncateText(plainText, 160) : data.site.description;
    }
  }
};
