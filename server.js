const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const getStats = require("./utils/getStats");
const pdf = require("pdf-parse");
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/analyse", (req, res) => {
  const file = req.files.file;
  pdf(file.data)
    .then((data) => {
      const fileStats = getStats(data.text);
      fileStats.numPages = data.numpages;
      res.status(200).send(fileStats);
    })
    .catch((err) => {
      res.status(400).send();
    });
});

app.listen(5000, () => console.log("listening on port 5000"));
