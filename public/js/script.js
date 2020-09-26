//UTILS
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//VARS
let uploadedFile;
const events = ["dragenter", "dragover", "dragleave", "drop"];

//DOM ELEMENTS
const input = document.querySelector(".dropZone__input");
const dropZone = document.querySelector(".dropZone__wrapper");
const fileDisplay = document.querySelector(".dropZone__file");
const analyseButton = document.querySelector(".buttons__button--analyse");
const loader = document.querySelector(".loader__wrapper");
const resultsModal = document.querySelector(".resultsModal__wrapper");
const numPages = document.querySelector(".resultsModal__pages");
const numWords = document.querySelector(".resultsModal__words");
const frequentWords = document.querySelector(".frequentWords__list");
const backButton = document.querySelector(".resultsModal__back");

//EVENT LISTENERS
input.addEventListener("change", handleUpload);
dropZone.addEventListener("dragenter", applyClass);
dropZone.addEventListener("dragover", applyClass);
dropZone.addEventListener("dragleave", removeClass);
dropZone.addEventListener("drop", handleUpload);
analyseButton.addEventListener("click", handleClickAnalyse);
backButton.addEventListener("click", handleClickBack);

//EVENT CALLBACKS
function handleUpload(e) {
  e.preventDefault();
  e.stopPropagation();
  removeClass(e);
  //if drop event
  if (e.dataTransfer && e.dataTransfer.files[0]) {
    uploadedFile = e.dataTransfer.files[0];
  } else {
    //if regular upload
    uploadedFile = e.target.files[0];
  }
  fileDisplay.textContent = uploadedFile.name;
}

function applyClass(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add("over");
}

function removeClass(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("over");
}

function handleClickAnalyse() {
  if (!uploadedFile) {
    alert("Please select a file");
    return;
  }
  loader.classList.remove("hidden");
  const data = getAnalysis();
  console.log(data);
}

function getAnalysis() {
  const formData = new FormData();
  formData.append("file", uploadedFile);
  axios
    .post("/analyse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      loader.classList.add("hidden");
      resultsModal.classList.remove("hidden");
      numPages.textContent = formatNumber(res.data.numPages);
      numWords.textContent = formatNumber(res.data.numWords);
      res.data.frequent.forEach((obj) => {
        const li = document.createElement("li");
        const wordSpan = document.createElement("span");
        wordSpan.setAttribute("class", "frequentWords__word");
        const wordText = document.createTextNode(obj.word);
        wordSpan.appendChild(wordText);
        const countSpan = document.createElement("span");
        countSpan.setAttribute("class", "frequentWords__count");
        const countText = document.createTextNode(formatNumber(obj.count));
        countSpan.appendChild(countText);
        li.appendChild(wordSpan);
        li.appendChild(countSpan);
        frequentWords.appendChild(li);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleClickBack() {
  resultsModal.classList.add("hidden");
  numPages.textContent = "";
  frequentWords.innerHTML = "";
}
