
const { sanitizeUsername, getProfileImageURL } = require("./authenticate");

test("Convert case-sensitive emails to lowercase usernames", ()=> {
  // expect(sanitizeUsername("UsEr@email.com")).toEqual("user")
})
