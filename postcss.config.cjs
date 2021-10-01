const cssnano = require("cssnano");
const postcssImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

const plugins =
  process.env.NODE_ENV === "production"
    ? [postcssImport, tailwindcss, autoprefixer, cssnano]
    : [postcssImport, tailwindcss, autoprefixer];

module.exports = { plugins };
