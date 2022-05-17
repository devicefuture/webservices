const express = require("express");
const app = express();

app.get("/", function(request, response) {
  response.send("Hello, world!");
});

app.listen(443, function() {
  console.log("Listening on port 443");
});