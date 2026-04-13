export default function(eleventyConfig) {
  // eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addCollection("meditations", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/meditations/*.md")
      .sort((a, b) => a.fileSlug.localeCompare(b.fileSlug, undefined, { numeric: true }));
  });

  return {
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
