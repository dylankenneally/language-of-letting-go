import "dotenv/config";
import markdownIt from "markdown-it";
import { generateRobotsTxt, generateSitemap } from "./scripts/generate-sitemap.js";
import { syncMeditationTitleAliases } from "./scripts/sync-meditation-title-aliases.js";
import { getPathPrefix, getSiteUrl } from "./site-config.js";
import { buildSearchDocuments, meditationIndex } from "./scripts/indices.js";
import { toTimeAttribute } from "./scripts/meditation-date.js"

export default function(eleventyConfig) {
  console.log(`Build started at ${new Date().toLocaleString()}`);
  eleventyConfig.addPassthroughCopy({ "src/fonts/*.woff2": "fonts" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/index.js": "vanilla-calendar-pro/index.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/styles": "vanilla-calendar-pro/styles" });
  eleventyConfig.addPassthroughCopy({ "node_modules/minisearch/dist/umd/index.js": "minisearch/index.js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ "src/images": "/images" });
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

  eleventyConfig.addCollection("searchDocuments", (collectionApi) => {
    return buildSearchDocuments(collectionApi.getAll());
  });

  // Converts "Month dd" string to "MM-DD" format for <time datetime> attribute
  eleventyConfig.addFilter("monthDayToMMDD", (monthDayString) => {
    return toTimeAttribute(monthDayString);
  });

  eleventyConfig.addFilter("meditationIndex", meditationIndex);

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
