import { formatDate } from "../meditation-date.js";

function stripFrontMatter(input) {
  return input.replace(/^---[\s\S]*?---\s*/, "");
}

function toPlainText(input) {
  return input
    // Remove Nunjucks/Liquid tags and comments from raw source.
    .replace(/\{#[\s\S]*?#\}/g, " ")
    .replace(/\{%[\s\S]*?%\}/g, " ")
    .replace(/\{\{[\s\S]*?\}\}/g, " ")
    // Remove HTML tags if content is already rendered.
    .replace(/<[^>]*>/g, " ")
    // Convert markdown links [text](url) to text.
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove common markdown formatting marks.
    .replace(/[*_`>#~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
