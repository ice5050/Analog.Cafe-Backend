process.env.NODE_ENV !== "development" && require("newrelic");
require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 8080;

app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log(`server is listening on ${port}...`);
});
