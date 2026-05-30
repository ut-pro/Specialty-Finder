const fileInput = document.getElementById("csvFile");
const table = document.getElementById("tableData");
const boxOne = document.querySelector(".boxOne");
const submitButton = document.getElementById("submitButton");
const findCommon = document.getElementById("findCommon");
const outputContainer = document.querySelector(".outputContainer");
const infoPara = document.querySelector(".infoPara");
const commonSpecialties = document.querySelector(".commonSpecialties");
const unCommonSpecialties = document.querySelector(".unCommonSpecialties");
const resetApp = document.getElementById("resetApp");

let data;
let givenSpecialties;

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const csvText = e.target.result;

    // console.log(csvText)

    data = csvToObjects(csvText);

    // console.log(data);

    displayTable(data);

    window.scrollBy({
      top: 250,
      behavior: "smooth",
    });
  };

  reader.readAsText(file);
});

// Convert CSV → JS Objects
function csvToObjects(csvText) {
  const rows = csvText.trim().split("\n");

  const headers = parseCSVRow(rows[0]);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVRow(rows[i]);

    const obj = {};

    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : "";
    });

    result.push(obj);
  }

  return result;
}

// Function to parse a single CSV row
function parseCSVRow(row) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);

  return values;
}

//input array
function processString(str) {
  const lines = str
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  const count = lines.length;

  return { count, specialty: lines };
}

submitButton.addEventListener("click", function () {
  commonSpecialties.innerHTML = "";
  unCommonSpecialties.innerHTML = "";
  submitButton.style.display = "none";

  let inputSpecialty = document.getElementById("specialty").value;

  if (inputSpecialty.trim() !== "") {
    document.querySelector(".result").style.display = "block";

    givenSpecialties = processString(inputSpecialty);

    // console.log(givenSpecialties);
  } else {
    alert("Please enter specialties");
    submitButton.style.display = "block";
  }
});

// if text there is some modification in text area then this part of code will run
document.getElementById("specialty").addEventListener("input", function () {
  infoPara.innerHTML = "";
  outputContainer.style.display = "none";
  submitButton.style.display = "block";
  findCommon.style.display = "block";
  document.querySelector(".result").style.display = "none";
  commonSpecialties.innerHTML = "";
  unCommonSpecialties.innerHTML = "";

  // remove table highlights
  const rows = document.querySelectorAll("#tableData tr");

  rows.forEach((row) => {
    row.classList.remove("matchRow");
  });
});

findCommon.addEventListener("click", function () {
  outputContainer.style.display = "block";
  findCommon.style.display = "none";

  let commonElements = [];
  let unCommonElements = [];
  let inputArr = givenSpecialties.specialty;

  for (let i = 0; i < inputArr.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (inputArr[i] === data[j].Specialty) {
        commonElements.push(inputArr[i]);
        break;
      }
    }
  }

  for (let i = 0; i < inputArr.length; i++) {
    if (!commonElements.includes(inputArr[i])) {
      unCommonElements.push(inputArr[i]);
    }
  }

  infoPara.innerHTML = `
<span class="found">✓ <span class="foundCount">${commonElements.length}</span> Found</span>
&nbsp;&nbsp;|&nbsp;&nbsp;
<span class="missing">✗ <span class="missingCount">${unCommonElements.length}</span> Missing</span>
&nbsp;&nbsp;|&nbsp;&nbsp;
Total <span class="totalCount">${givenSpecialties.count}</span>
`;

  const commonOne = document.createElement("p");
  let commonStr = "";

  for (let i = 0; i < commonElements.length; i++) {
    if (commonStr !== "") {
      commonStr = commonStr + "," + " " + commonElements[i];
    } else {
      commonStr = commonElements[i];
    }
  }

  commonOne.textContent = commonStr;
  commonSpecialties.appendChild(commonOne);

  const unCommonOne = document.createElement("p");
  let unCommonStr = "";

  for (let i = 0; i < unCommonElements.length; i++) {
    if (unCommonStr !== "") {
      unCommonStr = unCommonStr + "," + " " + unCommonElements[i];
    } else {
      unCommonStr = unCommonElements[i];
    }
  }

  unCommonOne.textContent = unCommonStr;
  unCommonSpecialties.appendChild(unCommonOne);

  // tabel content highlighting
  const tableRows = document.querySelectorAll("#tableData tbody tr");

  tableRows.forEach((row) => {
    // specialty column
    const specialtyText = row.cells[row.cells.length - 1].textContent.trim();

    if (commonElements.includes(specialtyText)) {
      row.classList.add("matchRow");
    } else {
      row.classList.remove("matchRow");
    }
  });

  // copy button
  document.getElementById("commonText").addEventListener("click", function () {
    const text = commonStr;
    navigator.clipboard.writeText(text);

    document.getElementById("commonText").innerText = "Copied!";

    setTimeout(() => {
      document.getElementById("commonText").innerText = "Copy";
    }, 2000);
  });

  document
    .getElementById("unCommonText")
    .addEventListener("click", function () {
      const text = unCommonStr;
      navigator.clipboard.writeText(text);

      document.getElementById("unCommonText").innerText = "Copied!";

      setTimeout(() => {
        document.getElementById("unCommonText").innerText = "Copy";
      }, 2000);
    });

  console.log(
    `There are ${givenSpecialties.count} specialities given and out of them ${commonElements.length} are available in our database and ${unCommonElements.length} are not available.`,
  );

  console.log(commonElements);
  console.log(unCommonElements);
});

// reset button
resetApp.addEventListener("click", reset);

function reset() {
  fileInput.value = "";
  infoPara.innerHTML = "";
  document.getElementById("specialty").value = "";
  boxOne.style.display = "none";
  outputContainer.style.display = "none";
  submitButton.style.display = "block";
  findCommon.style.display = "block";
  document.querySelector(".result").style.display = "none";
  table.innerHTML = "";
  commonSpecialties.innerHTML = "";
  unCommonSpecialties.innerHTML = "";
  data = [];

  document.getElementById("csvFile").style.display = "inline-block";
  document.getElementById("helperText").style.display = "block";
  document.getElementById("resetApp").style.display = "none";

  console.log("Every thing is removed");
}

// Display Data in Table
function displayTable(data) {
  boxOne.style.display = "flex";
  document.getElementById("csvFile").style.display = "none";
  document.getElementById("helperText").style.display = "none";
  document.getElementById("resetApp").style.display = "inline-block";

  table.innerHTML = "";

  if (data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach((row) => {
    const tr = document.createElement("tr");

    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = row[header];
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}

/* Back to top */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 350 ? "block" : "none";
});
backToTop.onclick = () => window.scrollTo({ top: 120, behavior: "smooth" });

// clear once reload
window.onload = reset;
