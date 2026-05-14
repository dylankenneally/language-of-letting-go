export default {
  eleventyComputed: {
    title: (data) => data.site.aboutTitle,
    description: (data) => data.site.aboutDescription,
  }
}
