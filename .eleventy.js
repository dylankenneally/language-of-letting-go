import "dotenv/config";
import markdownIt from "markdown-it";
import { generateRobotsTxt, generateSitemap } from "./scripts/generate-sitemap.js";
import { syncMeditationTitleAliases } from "./scripts/sync-meditation-title-aliases.js";
import { getPathPrefix, getSiteUrl } from "./site-config.js";

export default function(eleventyConfig) {
  console.log(`Build started at ${new Date().toLocaleString()}`);
  eleventyConfig.addPassthroughCopy({ "src/fonts/*.woff2": "fonts" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/index.js": "vanilla-calendar-pro/index.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/styles": "vanilla-calendar-pro/styles" });
  // eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const siteUrl = getSiteUrl();

    await syncMeditationTitleAliases(`${dir.input}/meditations`, dir.output);
    await generateSitemap({
      inputDir: `${dir.input}/meditations`,
      outputDir: dir.output,
      siteUrl
    });
    await generateRobotsTxt({ outputDir: dir.output, siteUrl });
  });

  eleventyConfig.addCollection("meditations", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/meditations/*.md")
      .sort((a, b) => a.fileSlug.localeCompare(b.fileSlug, undefined, { numeric: true }));
  });

  // Converts "Month dd" string to "MM-DD" format for <time datetime> attribute
  eleventyConfig.addFilter("monthDayToMMDD", (monthDayString) => {
    if (!monthDayString || typeof monthDayString !== 'string') return "";

    // Handle "MM.DD" format if passed (e.g. from fileSlug)
    if (monthDayString.includes('.')) return monthDayString.replace('.', '-');

    // Use an arbitrary year (e.g., 2000) to parse the month and day correctly
    const date = new Date(`2000 ${monthDayString}`);
    if (isNaN(date.getTime())) return "";

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  });

  const inlineMarkdown = markdownIt({ html: true });
  eleventyConfig.addPairedShortcode("quote", (content, attribution = "")=> {
    const quoteContent = inlineMarkdown.renderInline(content.trim());
    const quoteAttribution = attribution.trim()
      ? `<figcaption class="quote-attribution">${inlineMarkdown.renderInline(attribution.trim())}</figcaption>`
      : "";

    return `<figure class="quote"><blockquote>${quoteContent}</blockquote>${quoteAttribution}</figure>`;
  });

  eleventyConfig.addPairedShortcode("focal", (content)  => `<div class="focal-point">${inlineMarkdown.renderInline(content.trim())}</div>`);

  return {
    pathPrefix: getPathPrefix(),
    dir: {
      input: "src",
      output: "build",

      // sub directories from ./src/
      data: "data",
      includes: "includes",
      layouts: "layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
