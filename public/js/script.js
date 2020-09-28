const axios = require("axios");
const css = require("../css/styles.css");

//VARS
let uploadedFile;
let baseFileName;
let token;

//DOM ELEMENTS
const dropZoneInput = document.querySelector(".dropZone__input");
const dropZone = document.querySelector(".dropZone__wrapper");
const fileInfo = document.querySelector(".dropZone__info");
const fileDisplay = document.querySelector(".dropZone__filename");
const editButton = document.querySelector(".btn--edit");
const downloadButton = document.querySelector(".btn--download");
const cancelButton = document.querySelector(".btn--cancel");
const loader = document.querySelector(".loader__wrapper");
const editWrapper = document.querySelector(".edit__wrapper");
const editTextarea = document.querySelector(".edit__textarea");
const saveButton = document.querySelector(".btn--save");
const clearButton = document.querySelector(".dropZone__clear");
const downloadInfo = document.querySelector(".download__message");
const editFilename = document.querySelector(".edit__filename");

//EVENT LISTENERS

dropZoneInput.addEventListener("change", handleUpload);
dropZone.addEventListener("dragenter", applyClass);
dropZone.addEventListener("dragover", applyClass);
dropZone.addEventListener("dragleave", removeClass);
dropZone.addEventListener("drop", handleUpload);
editButton.addEventListener("click", handleClickEdit);
downloadButton.addEventListener("click", handleDownload);
cancelButton.addEventListener("click", handleClear);
saveButton.addEventListener("click", handleSave);
clearButton.addEventListener("click", handleClear);

window.onbeforeunload = () => {
  if (uploadedFile) {
    return "Are you sure?";
  } else {
    null;
  }
};

//EVENT CALLBACKS
function handleSave() {
  const text = editTextarea.value;
  baseFileName = uploadedFile.name.substring(0, uploadedFile.name.length - 4);
  axios
    .post("http://localhost:5000/save", { text, fileName: baseFileName })
    .then((res) => {
      token = res.data.token;
      editWrapper.classList.add("hidden");
      editButton.classList.add("hidden");
      downloadButton.classList.remove("hidden");
      cancelButton.classList.remove("hidden");
      downloadInfo.classList.remove("hidden");
      dropZone.classList.add("hidden");
    })
    .catch((err) => {});
}

function handleDownload() {
  window.open(`http://localhost:5000/download/${baseFileName}-${token}`);
  handleClear();
}

function handleUpload(e) {
  e.preventDefault();
  e.stopPropagation();
  //if drop event
  if (e.dataTransfer && e.dataTransfer.files[0]) {
    uploadedFile = e.dataTransfer.files[0];
  } else {
    //if regular upload
    uploadedFile = e.target.files[0];
    applyClass();
  }
  fileDisplay.textContent = uploadedFile.name;
  fileDisplay.setAttribute("title", uploadedFile.name);
  fileInfo.classList.add("displayed");
  clearButton.classList.remove("hidden");
  editButton.classList.remove("hidden");
}

function applyClass(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  dropZone.classList.add("over");
}

function removeClass() {
  dropZone.classList.remove("over");
}

function handleClickEdit() {
  if (!uploadedFile) {
    alert("Please select a file");
    return;
  }
  loader.classList.remove("hidden");
  const formData = new FormData();
  formData.append("file", uploadedFile);
  axios
    .post("http://localhost:5000/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      loader.classList.add("hidden");
      editWrapper.classList.remove("hidden");
      editTextarea.value = res.data;
      editFilename.textContent = uploadedFile.name;
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleClear() {
  uploadedFile = null;
  dropZoneInput.value = "";
  fileDisplay.textContent = "";
  fileDisplay.setAttribute("title", "");
  fileInfo.classList.remove("displayed");
  clearButton.classList.add("hidden");
  downloadButton.classList.add("hidden");
  cancelButton.classList.add("hidden");
  editWrapper.classList.add("hidden");
  removeClass();
  dropZone.classList.remove("hidden");
  downloadInfo.classList.add("hidden");
}
