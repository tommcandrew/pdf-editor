const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const pdfDocument = require("pdfkit");
const short = require("short-uuid");
const cors = require("cors");

const app = express();
app.listen(5000, () => console.log("listening on port 5000"));

app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(express.json());
app.use(cors());

app.post("/edit", (req, res) => {
  const file = req.files.file;
  pdf(file.data)
    .then((data) => {
      res.status(200).send(data.text);
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

app.post("/save", (req, res) => {
  const { text, fileName } = req.body;
  const token = short.generate();
  const doc = new pdfDocument();
  doc.pipe(fs.createWriteStream(`${fileName}-${token}.pdf`));
  doc.text(text);
  doc.end();
  res.status(200).send({ token });
});

app.get(`/download/:file`, (req, res) => {
  const file = req.params.file;
  res.download(`./${file}.pdf`);
  setTimeout(() => {
    fs.unlink(`./${file}.pdf`, (err) => {
      if (err) console.log(err);
      console.log("file was deleted");
    });
  }, 10000);
});
