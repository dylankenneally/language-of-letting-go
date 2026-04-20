import { readFileSync } from "node:fs";
import "dotenv/config";

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
  // eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addCollection("meditations", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/meditations/*.md")
      .sort((a, b) => a.fileSlug.localeCompare(b.fileSlug, undefined, { numeric: true }));
  });

  return {
    pathPrefix: getPathPrefix(),
    dir: {
      input: "src",
      output: "build",

      // sub directories from ./src/
      data: "data",
      // includes: "includes",
      layouts: "layouts",

      // data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
