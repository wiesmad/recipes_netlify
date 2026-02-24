module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");

  // Kopiuje pliki sitemap.xml i robots.txt bezpośrednio do folderu wyjściowego
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("robots.txt");
  // Kopiuje zawartość public/fonts do folderu fonts w _site
  eleventyConfig.addPassthroughCopy({ "public/fonts": "fonts" });

  return {
    // ADD THESE TWO LINES:
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",

    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
};
