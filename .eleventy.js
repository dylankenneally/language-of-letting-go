import { readFileSync } from "node:fs";
import "dotenv/config";
import markdownIt from "markdown-it";
import { syncMeditationTitleAliases } from "./scripts/sync-meditation-title-aliases.js";

function getPathPrefix() {
  const configuredPrefix = process.env.ELEVENTY_PATH_PREFIX;
  if (configuredPrefix) {
    return configuredPrefix;
  }

  try {
    const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
    const homepage = packageJson.homepage;
    if (!homepage) {
      return "/";
    }

    const pathname = new URL(homepage).pathname.replace(/\/+$/, "");
    return pathname || "/";
  } catch {
    return "/";
  }
}

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/fonts/*.woff2": "fonts" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/index.js": "vanilla-calendar-pro/index.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/vanilla-calendar-pro/styles": "vanilla-calendar-pro/styles" });
  // eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    await syncMeditationTitleAliases(`${dir.input}/meditations`, dir.output);
  });

  eleventyConfig.addCollection("meditations", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/meditations/*.md")
      .sort((a, b) => a.fileSlug.localeCompare(b.fileSlug, undefined, { numeric: true }));
  });

  const inlineMarkdown = markdownIt({ html: true });
  eleventyConfig.addPairedShortcode("quote", (content, attribution = "")=> {
    const quoteContent = inlineMarkdown.renderInline(content.trim());
    const quoteAttribution = attribution.trim()
      ? `<span class="quote-attribution">${inlineMarkdown.renderInline(attribution.trim())}</span>`
      : "";

    return `<div class="quote">${quoteContent}${quoteAttribution}</div>`;
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
