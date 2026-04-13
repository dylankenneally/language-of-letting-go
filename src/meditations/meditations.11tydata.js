// fileSlug is in the format "mm.dd", this returns a URL friendly English version of that string
// i.e. "01.01" -> "january-1" & "12.31" -> "december-31"
function formatDate(fileSlug) {
  const [month, day] = fileSlug.split(".").map(Number);
  const date = new Date(2000, month - 1, day); // year doesn't matter
  let result = date.toLocaleString("en", { month: "long", day: "numeric" }); // todo: using english string in code - what about i18n/l10n?
  result = result.toLowerCase().replace(/\s+/g, "-");
  return result;
}

export default {
  tags: ["meditation"],
  layout: "meditation.njk",
  permalink: ({ page }) => `/${formatDate(page.fileSlug)}/index.html`
};
