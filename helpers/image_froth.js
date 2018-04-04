// tools
const { froth } = require("@roast-cms/image-froth")

// constants
const IMAGE_FROTH_SERVER =
  "https://res.cloudinary.com/analog-cafe/image/upload/"
const IMAGE_FROTH_OPTIONS = "c_scale,fl_progressive"
const IMAGE_FROTH_SIZES = {
  t: "280",
  s: "520",
  m: "1268",
  l: "1800"
}

const FROTH_CONSTANTS = {
  // cloudinary server and subfolder location
  server: "https://res.cloudinary.com/analog-cafe/image/upload/",
  // transformations (array) for images (kept constant)
  transformations: "c_scale,fl_progressive",
  // all sizes are image widths; heights are relative
  sizes: {
    i: "40", // icon
    t: "280", // tiny
    s: "520", // small
    m: "1268", // medium (required default)
    l: "1800" // large
  }
}

const imageFroth = options => froth(options, FROTH_CONSTANTS)

module.exports = {
  imageFroth
}
