export default {
  eleventyComputed: {
    title: (data) => data.site.searchTitle,
    description: (data) => data.site.searchDescription
  }
};
