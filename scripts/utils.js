export function stripFrontMatter(input = "") {
  return input.replace(/^---[\s\S]*?---\s*/, "");
}

export function toPlainText(input = "") {
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
