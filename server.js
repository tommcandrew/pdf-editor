const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(5000, () => console.log("listening on port 5000"));
