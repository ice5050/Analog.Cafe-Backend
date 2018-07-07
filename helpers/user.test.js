const {parseButtons} = require("./user")

test("Parse buttons string to object", ()=>{
  expect(parseButtons(
    '[{"to":"/author/bailey-tovar","text":"More on Analog.Cafe","branded":true},{"to":"https://www.instagram.com/bai_latte/","text":"Follow on Instagram"}]'
  )).toEqual([
        {
            "to" : "/author/bailey-tovar",
            "text" : "More on Analog.Cafe",
            "branded" : true
        },
        {
            "to" : "https://www.instagram.com/bai_latte/",
            "text" : "Follow on Instagram"
        }
    ])
})
