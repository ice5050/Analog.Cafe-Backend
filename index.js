require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 8080;

require("./newrelic");

app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log(`server is listening on ${port}...`);
});
