export default {
  eleventyComputed: {
    title: (data) => data.site.meditationsIndex,
    description: (data) => data.site.meditationsIndexDescription
  }
};
