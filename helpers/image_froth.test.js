const { imageFroth } = require("./image_froth");

test("Successfully generate image data via imageFroth from slug", () => {
  expect(imageFroth({ src: "image-froth_1500000_BJ7LbcnLGb" })).toEqual({
    height: 845,
    width: 1268,
    ratio: 1.5,
    src:
      "https://res.cloudinary.com/analog-cafe/image/upload/c_scale,fl_progressive,w_1268/image-froth_1500000_BJ7LbcnLGb.jpg",
    type: "jpg"
  });
});
