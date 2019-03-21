
const { parseButtons } = require("./user");
const buttonsString =
  '[{"to":"/author/bailey-tovar","text":"More on Analog.Cafe","branded":true},{"to":"https://www.instagram.com/bai_latte/","text":"Follow on Instagram"}]';
const buttonsObject = [
  {
    to: "/author/bailey-tovar",
    text: "More on Analog.Cafe",
    branded: true
  },
  {
    to: "https://www.instagram.com/bai_latte/",
    text: "Follow on Instagram"
  }
];
test("Parse buttons string to object", () => {
  expect(parseButtons(buttonsString)).toEqual(buttonsObject);
});
