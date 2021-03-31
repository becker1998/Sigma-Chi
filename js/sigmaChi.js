//Sigma-Chi, written by Connor St. Louis - 2021

//GLOBAL VARS

//2D array storing arrays of each dataset entered
//index will correspond to the order that the datasets are listed
var datasets = new Array();

//2D array storing arrays of the corresponding dataset
//index will corrspond to the correct index of the datasets array
var datasetsUncer = new Array();

//The global array will keep track of all the manually rejected data
var rejectedData = new Array();

//global variable that keeps track of the current datatset
//displayed in the table
var tracker = 0;

//global var to keep track of which dataset is being selected/highlighted for usability
var highlight;

//These are the global values in the Evaluations Pop up for backend to access. They are updated when a user selects an option. Default value 0 = No option selected
var eUncertainty = 2;
var eRejection = 0;
var eData = 0;
var eWtdAvg = 0;
var eFunction = 0;
var eBandwidth = 0.8333333333333334;

//keeps track of number of datasets created in session for naming purposes.
var numberOfDatasetsCreated = 1;

//Global array for possible colours to use for grahping lines
var colours = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

function appendToReject() {
  if (eRejection != 0) {
    var checkId = getCheckedID();
    var allData = Data_Points_With_Uncertainty(
      getGraphableData(checkId),
      getGraphableUncertainty(checkId),
      eUncertainty
    );
    var weightedMean = weighted_Mean(allData);
    var threshold = eRejection * standardDeviation(allData, true);
    var arr = rejectedData[tracker - 1];
    var correctArray = false;
    if (Array.isArray(arr)) {
      correctArray = true;
    }
    for (i = 0; i < allData.length; i++) {
      if (allData[i][0] > weightedMean + threshold || allData[i][0] < weightedMean - threshold) {
        if (correctArray) {
          rejectedData[tracker - 1].push(i + 1);
          var id = "reject" + (i + 1);
        } else {
          var tempArray = new Array();
          tempArray[0] = i + 1;
          rejectedData[tracker - 1] = tempArray;
          correctArray = true;
          var id = "reject" + (i + 1);
        }
        checkRejectedData(id);
      }
    }
  }
}

function rejectionSpecific() {
  updateEvaluationSettingsRejection();
  updateAllEvalSettings();
  return false;
}

//all except rejection
function updateAllEvalSettings() {
  updateEvaluationSettingsUncertainty();
  updateEvaluationSettingsData();
  updateEvaluationSettingsWtdAvg();
  updateEvaluationSettingsFunction();
  updateEvaluationSettingsBandwidth();
}

function updateEvaluationSettings(firstGo) {
  var dataID = "checkdata" + tracker;
  console.log("tracker: " + tracker);
  if (document.getElementById(dataID)) {
    var checkBox = document.getElementById(dataID);
    if (checkBox.checked == true && !firstGo) {
      dynamicGraph(dataID);
    }
  } else {
    console.log("deleted");
    for (i = 0; i < datasets.length; i++) {
      if (datasets[i] != undefined) {
        dataID = "checkdata" + (i + 1);
        console.log("dataID found: " + dataID);
        dynamicGraph(dataID);
      }
    }
  }
}

function forceUpdate(id) {
  console.log("forceUpdate");
  var dataID = "checkdata" + tracker;
  dynamicGraph(id);
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsUncertainty() {
  var selectBox = document.getElementById("uncertaintySelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eUncertainty = selectedValue;
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsRejection() {
  var selectBox = document.getElementById("rejectionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eRejection = selectedValue;
  appendToReject();
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsData() {
  var selectBox = document.getElementById("dataSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eData = selectedValue;
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsWtdAvg() {
  var selectBox = document.getElementById("wtdAvgSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eWtdAvg = selectedValue;
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsFunction() {
  var selectBox = document.getElementById("functionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eFunction = selectedValue;
  updateEvaluationSettings(false);
}

function updateEvaluationSettingsBandwidth() {
  var selectBox = document.getElementById("bandwidthRange");
  var selectedValue = selectBox.value;
  eBandwidth = selectedValue;
  updateEvaluationSettings(false);
}

//function will download data inputed in on a selected datatset as a csv file
//download will happen when the user clicks the download icon
function downloadData(index) {
  //setup data as an array of rows
  const rows = [["Data", "Uncertainty"]];
  var getDataset = datasets[index];
  var getUncert = datasetsUncer[index];
  if (getDataset && getDataset.length) {
    for (var i = 1; i < getDataset.length + 1; i++) {
      rows.push([getDataset[i], getUncert[i]]);
    }
  }
  //format the data into csv compatible format
  var csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function (rowArray) {
    var row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encode = encodeURI(csvContent);
  var setNum = index;
  var dataId = "set" + setNum;
  var getFileName = document.getElementById(dataId).value;
  var fileName = getFileName + ".csv";
  //create a hidden download link and initiate a click
  var hiddenLink = document.createElement("a");
  hiddenLink.setAttribute("href", encode);
  hiddenLink.setAttribute("download", fileName);
  document.body.appendChild(hiddenLink);
  hiddenLink.click();
}

function downloadAllData() {
  var checkedData = getCheckedDatasets();
  if (checkedData.length == 0) {
    var numData = datasets.length;
    for (var i = 0; i < numData; i++) {
      if (datasets[i] !== undefined || datasets[i] !== null) {
        downloadData(i);
      }
    }
  } else {
    downloadCheckedData();
  }
}

function downloadCheckedData() {
  var checkedData = getCheckedDatasets();
  for (var i = 0; i < checkedData.length; i++) {
    if (datasets[i] !== undefined || datasets[i] !== null) {
      downloadData(checkedData[i]);
    }
  }
}
//this function will add a new row to table on button click
//FUNCTION IS CURRENTLY UNTESTED
function addRow() {
  var tbl = document.getElementById("tbl");
  var tbody = tbl.querySelector("tbody");
  var checkElem = tbody.querySelector("input");
  //check to see if table is empty
  if (checkElem !== null) {
    var inp = tbody.querySelectorAll('input[type="checkbox"]').length;
    var inpVal = tbody.querySelectorAll('input[type="number"]').length / 2;
  } else {
    var inp = 0;
    var inpVal = 0;
  }

  var newRow = document.createElement("tr");
  var idCol = document.createElement("td");
  var rejCol = document.createElement("td");
  var dataCol = document.createElement("td");
  var dataInput = document.createElement("input");
  var uncCol = document.createElement("td");
  var colInput = document.createElement("input");

  idCol.className = "pt-3-half custom-table-body";
  rejCol.className = "pt-3-half custom-table-body";
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("value", "");
  var inpDataID = "dataInput" + (inpVal + 1);
  dataInput.setAttribute("id", inpDataID);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataCol.setAttribute("contenteditable", "false");
  dataCol.className = "pt-3-half custom-table-body";
  dataInput.setAttribute("step", "0.01");
  dataInput.className = "table-input-fields";

  uncCol.className = "pt-3-half custom-table-body";
  colInput.setAttribute("type", "number");
  colInput.setAttribute("value", "");
  var inpColId = "colInput" + (inpVal + 1);
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
  colInput.setAttribute("step", "0.01");
  uncCol.setAttribute("contenteditable", "false");
  colInput.className = "table-input-fields";

  dataCol.appendChild(dataInput);
  uncCol.appendChild(colInput);

  newRow.appendChild(idCol);
  newRow.appendChild(rejCol);
  newRow.appendChild(dataCol);
  newRow.appendChild(uncCol);

  var checkBox = document.createElement("input");
  checkBox.className = "text-center";
  checkBox.setAttribute("type", "checkbox");
  var numCheck = inp + 1;
  var id = "reject" + numCheck;
  var rejectFunction = "getRejectedData(" + numCheck + ")";
  checkBox.setAttribute("onchange", rejectFunction);
  checkBox.setAttribute("id", id);
  rejCol.appendChild(checkBox);

  var rowCount = tbody.getElementsByTagName("tr").length + 1;
  idCol.innerText = rowCount.toLocaleString();

  tbody.appendChild(newRow);
  if (rejectedData[tracker - 1] !== undefined) {
    if (rejectedData[tracker - 1].includes(numCheck)) {
      checkRejectedData(id);
    }
  }
}

//if no data has been added this fucntion will be called and then
//add a default of 5 rows
function addEmptyTableBody() {
  var tbl = document.getElementById("tbl");
  if (tbl.querySelectorAll("tr") && tbl.querySelectorAll("tr").length) {
    var numRows = tbl.querySelectorAll("tr").length;
    if (numRows <= 1) {
      for (var i = 0; i < 5; i++) {
        addRow();
      }
    }
  }
}

function getRejectedData(idNum) {
  var arr = rejectedData[tracker - 1];
  var id = "reject" + idNum;
  if (document.getElementById(id)) {
    var checkBox = document.getElementById(id);
    if (checkBox.checked == true) {
      if (Array.isArray(arr)) {
        rejectedData[tracker - 1].push(idNum);
      } else {
        var tempArray = new Array();
        tempArray[0] = idNum;
        rejectedData[tracker - 1] = tempArray;
      }
    } else {
      if (Array.isArray(arr)) {
        var data = rejectedData[tracker - 1];
        if (data.includes(idNum)) {
          var getIndex = data.indexOf(idNum);
          rejectedData[tracker - 1].splice(getIndex, 1);
        }
      }
    }
  }
  var dataID = "checkdata" + tracker;
  if (document.getElementById(dataID)) {
    var checkBox = document.getElementById(dataID);
    if (checkBox.checked == true) {
      updateAllEvalSettings();
      dynamicGraph(dataID);
    }
  }
}
//fucntion will be called when the software detects a change in
//the the data column of the table and will update the table with the new change
//input is the html element being passed in after change is made
function onDataChange(input) {
  var newValue = Number(input.value);
  var inputId = input.id;
  var rowNum = Number(inputId.match(/\d+$/));
  var arr = datasets[tracker - 1];

  //determines is the data is already loaded into the gloabl array
  if (Array.isArray(datasets[tracker - 1])) {
    datasets[tracker - 1][0] = rowNum;
    datasets[tracker - 1][rowNum] = newValue;
  } else {
    var tempArray = new Array();
    tempArray[0] = rowNum;
    tempArray[rowNum] = newValue;
    datasets[tracker - 1] = tempArray;
  }

  var dataID = "checkdata" + tracker;
  if (document.getElementById(dataID)) {
    var checkBox = document.getElementById(dataID);
    if (checkBox.checked == true) {
      updateAllEvalSettings();
      dynamicGraph(dataID);
    }
  }
}
//function is called when a change is detected in the uncertainty table
//work in the exact same as onDataChange()
function onColChange(input) {
  var newValue = Number(input.value);
  var inputId = input.id;
  var rowNum = Number(inputId.match(/\d+$/));
  var arr = datasetsUncer[tracker - 1];

  if (Array.isArray(arr)) {
    datasetsUncer[tracker - 1][0] = newValue;
    datasetsUncer[tracker - 1][rowNum] = newValue;
  } else {
    var tempArray = new Array();
    tempArray[0] = newValue;
    tempArray[rowNum] = newValue;
    datasetsUncer[tracker - 1] = tempArray;
  }

  var dataID = "checkdata" + tracker;
  if (document.getElementById(dataID)) {
    var checkBox = document.getElementById(dataID);
    if (checkBox.checked == true) {
      updateAllEvalSettings();
      dynamicGraph(dataID);
    }
  }
}
//this function is called in sequence after the user imports a csv file
//this function will populate the table with the corresponding data
function addRowWithData(data, uncert) {
  var tbl = document.getElementById("tbl");
  var tbody = tbl.querySelector("tbody");
  var checkElem = tbody.querySelector("input");
  if (checkElem !== null) {
    var inp = tbody.querySelectorAll('input[type="checkbox"]').length;
    //because there are 2 input of this type
    var inpVal = tbody.querySelectorAll('input[type="number"]').length / 2;
  } else {
    var inp = 0;
    var inpVal = 0;
  }

  var newRow = document.createElement("tr");
  var idCol = document.createElement("td");
  var rejCol = document.createElement("td");
  var dataCol = document.createElement("td");
  var uncCol = document.createElement("td");
  var dataInput = document.createElement("input");
  var colInput = document.createElement("input");

  idCol.className = "pt-3-half custom-table-body";
  rejCol.className = "pt-3-half custom-table-body";
  dataCol.className = "pt-3-half custom-table-body";
  dataCol.setAttribute("contenteditable", "false");
  var inpDataId = "dataInput" + (inpVal + 1);
  var inpColId = "colInput" + (inpVal + 1);
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("id", inpDataId);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataInput.setAttribute("step", "0.01");
  dataInput.className = "table-input-fields";
  if (data !== undefined || data !== null) {
    dataInput.setAttribute("value", data);
  }
  uncCol.className = "pt-3-half custom-table-body";
  uncCol.setAttribute("contenteditable", "false");
  colInput.setAttribute("type", "number");
  colInput.setAttribute("step", "0.01");
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
  colInput.className = "table-input-fields";
  if (uncert !== undefined || uncert !== null) {
    colInput.setAttribute("value", uncert);
  }

  dataCol.appendChild(dataInput);
  uncCol.appendChild(colInput);

  newRow.appendChild(idCol);
  newRow.appendChild(rejCol);
  newRow.appendChild(dataCol);
  newRow.appendChild(uncCol);

  var checkBox = document.createElement("input");
  checkBox.className = "form-check-input text-center";
  checkBox.setAttribute("type", "checkbox");
  var numCheck = inp + 1;
  var id = "reject" + numCheck;
  var rejectFunction = "getRejectedData(" + numCheck + ")";
  checkBox.setAttribute("onchange", rejectFunction);
  checkBox.setAttribute("id", id);
  rejCol.appendChild(checkBox);

  var rowCount = tbody.getElementsByTagName("tr").length + 1;
  idCol.innerText = rowCount.toLocaleString();

  tbody.appendChild(newRow);
  if (rejectedData[tracker - 1] !== undefined) {
    if (rejectedData[tracker - 1].includes(numCheck)) {
      checkRejectedData(id);
    }
  }
}

function checkRejectedData(id) {
  if (document.getElementById(id)) {
    document.getElementById(id).checked = true;
  }
}

//function will instantiate the table
function addTableBody(input) {
  var data = datasets[input - 1];
  var uncert = datasetsUncer[input - 1];
  if (data && uncert && data.length && uncert.length) {
    var maxLength = Math.max(data.length, uncert.length);
    var getBody = document.getElementById("tblBody");
    getBody.innerHTML = "";
    for (var i = 1; i < maxLength; i++) {
      addRowWithData(data[i], uncert[i]);
    }
  }
}
//function will retrieve all files inputted from clicking "Import"
//first reads in as a text string and then converts and updates
//global variables glData and glUncer
//need to modify to read into and array (global var)
//FUNCTION IS CURRENTLY UNTESTED
function dataFile(input) {
  let file = input.files[0];
  var glData = new Array();
  var glUncer = new Array();
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    var splt = reader.result.trim().split("\n");
    var fields = splt.splice(0, 1);
    for (var i = 0; i < splt.length; i++) {
      var array = splt[i].split(",").map(Number);
      glData.push(array[0]);
      glUncer.push(array[1]);
    }
    addCSVTable(glData, glUncer);
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}

//this function is called within dataFile() and stores the csv data
//into 2 global arrays: datasets and datasetsUncer. It uses 2 helper functions:
//addingDataset() will do the hard work in storing data
//addCSVTable() will update and dataset links to frontend
function addCSVTable(data, uncertainty) {
  var numDataSets = document.getElementById("datasets").querySelectorAll("div").length;
  var id = numDataSets;
  addingDataset(id, data, uncertainty);
  addNewData();
  var dataID = "data" + id;
  updateAllEvalSettings();
  dynamicGraph(dataID);
}

//this function adds a dataset to the 2D array of daatsets to keep
//track of the number of datasets
//function takes 2 parameter data that is an array of data
//and uncertainty which is an array of uncertainties corrsponding to the
//respective data
function addingDataset(id, data, uncertainty) {
  data.unshift(id);
  uncertainty.unshift(id);
  datasets[id] = data;
  datasetsUncer[id] = uncertainty;
}

//function will get the data for the correspongding dataset
//a load it into a dynamic table
//function uses 2 helper funtions:
//addEmptyTableBody() which creates an empty dynamic table
//and
//addTableBody(input) which passes in the corresponing index
//that points to the dataset and creates the table with the data
function getData(input) {
  var indexValue = typeof datasets[input - 1];
  tracker = input;
  if (indexValue == "undefined") {
    var tblBody = document.getElementById("tblBody");
    tblBody.innerHTML = "";
    addEmptyTableBody();
  } else if (indexValue !== "undefined") {
    addTableBody(input);
  }
}
//function will add new labels that represent additional DataSets
function addNewData() {
  numberOfDatasetsCreated++; //alternative to numLabels, needed to track total since we can now delete sets.
  var div = document.getElementById("datasets");

  var newDivData = document.createElement("div");
  newDivData.className = "text-center datasetBox d-flex align-items-center";
  var divID = "data" + numberOfDatasetsCreated;
  var onclickFunc = "getData(" + numberOfDatasetsCreated + ")";
  newDivData.setAttribute("id", divID);
  newDivData.setAttribute("onclick", onclickFunc + "; highlightSelection(this);");

  var newLabel = document.createElement("input");
  var datasetID = "set" + numberOfDatasetsCreated;
  newLabel.setAttribute("type", "text");
  newLabel.className = "col-sm-8 dataset-names";
  newLabel.setAttribute("id", datasetID);
  newLabel.setAttribute("onfocusout", "toggleEdit(this)");
  newLabel.setAttribute("disabled", "true");
  var dataText = "Data Set " + numberOfDatasetsCreated;
  newLabel.setAttribute("value", dataText);

  var newCheckBox = document.createElement("input");
  newCheckBox.className = "col-sm-2";
  newCheckBox.setAttribute("type", "checkbox");
  newCheckBox.setAttribute("onclick", "forceUpdate(this.id)");
  //newCheckBox.setAttribute("checked", "true");
  var checkboxID = "checkdata" + numberOfDatasetsCreated;
  newCheckBox.setAttribute("id", checkboxID);

  // DROPDOWN MENU
  var dropdownMenu = document.createElement("span");
  dropdownMenu.className = "dropdown d-flex align-items-center";

  var editButton = document.createElement("button");
  editButton.className = "col-sm-2 edit-label material-icons w-100";
  editButton.setAttribute("data-toggle", "dropdown");
  editButton.setAttribute("aria-expanded", "false");
  editButton.innerHTML = "edit";

  var dropdownOptions = document.createElement("ul");
  dropdownOptions.className = "dropdown-menu edit-dropdown dropdown-menu-right";
  dropdownOptions.setAttribute("aria-labelledby", "edit" + numberOfDatasetsCreated);

  var editOption = document.createElement("a");
  editOption.className = "dropdown-item dropdown-edit-options cursor-fix";
  editOption.setAttribute("id", "edit" + numberOfDatasetsCreated);
  editOption.setAttribute("onclick", "editLabel(this)");
  editOption.innerHTML = "<b>Rename</b>";

  var deleteOption = document.createElement("a");
  deleteOption.className = "dropdown-item dropdown-edit-options cursor-fix";
  deleteOption.setAttribute("id", "del" + numberOfDatasetsCreated);
  deleteOption.setAttribute("onclick", "deleteDataset(this)");
  deleteOption.innerHTML = "<b>Delete</b>";

  var optionOne = document.createElement("li");
  var optionTwo = document.createElement("li");

  optionOne.appendChild(editOption);
  optionTwo.appendChild(deleteOption);
  dropdownOptions.appendChild(optionOne);
  dropdownOptions.appendChild(optionTwo);
  dropdownMenu.appendChild(editButton);
  dropdownMenu.appendChild(dropdownOptions);

  newDivData.appendChild(newLabel);
  newDivData.appendChild(newCheckBox);
  newDivData.appendChild(dropdownMenu);
  div.appendChild(newDivData);
}

//edit option for datasets
//function that makes dataset label editable and auto focuses user on it
function editLabel(input) {
  var iD = input.id;
  var parts = iD.split("t");
  var idNum = Number(parts[1]);
  if (document.getElementById("set" + idNum)) {
    var labelID = document.getElementById("set" + idNum);
    labelID.removeAttribute("disabled");
    labelID.focus();
    labelID.select();
  }
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      toggleEdit(input);
    }
  });
}

//if user clicks out of text box then label becomes uneditable
function toggleEdit(input) {
  var iD = input.id;
  var parts = iD.split("t");
  var idNum = Number(parts[1]);
  updateEvaluationSettings(false);
  if (document.getElementById("set" + idNum)) {
    var labelID = document.getElementById("set" + idNum);
    labelID.setAttribute("disabled", "true");
  }
}

//delete option for datasets
//function that removes dataset from list on frontend and makes it's data in dataset = null
function deleteDataset(input) {
  //delete front end component
  var iD = input.id;
  var parts = iD.split("l");
  var idNum = Number(parts[1]);
  if (document.getElementById("checkdata" + idNum)) {
    var checkbox = document.getElementById("checkdata" + idNum);
    checkbox.checked = false;
    console.log("unchecked");
  }
  if (document.getElementById("data" + idNum)) {
    var datasetDiv = document.getElementById("data" + idNum);
    datasetDiv.remove();
    //make data = null in datasets array
    datasets[idNum - 1] = undefined;
    datasetsUncer[idNum - 1] = undefined;
    rejectedData[idNum - 1] = undefined;
  }
  updateEvaluationSettings(false);
}

//highlights dataset thats currently selected
function highlightSelection(input) {
  if (highlight == null) {
    var data1 = document.getElementById("data1");
    data1.classList.remove("highlighted-dataset");
    data1.classList.add("datasetBox");
    highlight = input;
    highlight.classList.remove("datasetBox");
    highlight.classList.add("highlighted-dataset");
  } else if (input != highlight) {
    highlight.classList.remove("highlighted-dataset");
    highlight.classList.add("datasetBox");
    highlight = input;
    highlight.classList.remove("datasetBox");
    highlight.classList.add("highlighted-dataset");
  }
}

//function input is data point values and uncertainties for each data point.
//the function returns an array in the form array[0] = new array (data point, uncertainty max, uncertainty min), array[1] = new array (data point 2, ........
//for example, if the customer enters 10, 1.  10 being the data point, 1 being the uncertainty, then array[0] = (10,11,9)
function Data_Points_With_Uncertainty(data, uncertainties, twosigma) {
  if (data === undefined) {
    alert("error using the current dataset");
    return null;
  }
  if (uncertainties === undefined) {
    alert("error using the current uncertainties");
    return null;
  }

  var dataWithUncertainties = new Array();
  if (data.length) {
    for (i = 0; i < data.length; i++) {
      if (twosigma == 1) {
        var uncertaintyMax = data[i] + uncertainties[i] * 2;
        var uncertaintyMin = data[i] - uncertainties[i] * 2;
      } else {
        var uncertaintyMax = data[i] + uncertainties[i];
        var uncertaintyMin = data[i] - uncertainties[i];
      }
      dataWithUncertainties[i] = new Array(data[i], uncertaintyMax, uncertaintyMin);
    }
  }
  return dataWithUncertainties;
}

//function returns the weighted mean based on data points with uncertainty being used as the weight
//the argument allData should be an array returned directly from Data_Points_With_Uncertainty
//documentation on function implemented can be found here: http://seismo.berkeley.edu/~kirchner/Toolkits/Toolkit_12.pdf
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
function weighted_Mean(allData) {
  var weightedMean = 0.0;
  var sumOfWeights = 0.0;
  //for each data point
  if (allData.length) {
    for (i = 0; i < allData.length; i++) {
      //sum of all data points * their respective weights
      weightedMean += allData[i][0] * (allData[i][1] - allData[i][0]); //(allData[i][1] - allData[i][0]) = uncertanty
      sumOfWeights += allData[i][1] - allData[i][0]; //(allData[i][1] - allData[i][0]) = uncertanty
    }
  }
  weightedMean = weightedMean / sumOfWeights;
  return weightedMean;
}

//function returns the weighted mean variance
//the argument allData should be an array returned directly from Data_Points_With_Uncertainty
//documentation on function implemented can be found here: http://seismo.berkeley.edu/~kirchner/Toolkits/Toolkit_12.pdf
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
function weighted_Mean_Variance(allData) {
  var weightedMeanVariance = 0.0;
  var weight = 0.0;
  var sumOfWeights = 0.0;
  if (allData && allData.length) {
    var weightedMean = weighted_Mean(allData);
    //for each data point
    for (i = 0; i < allData.length; i++) {
      //w(x-weightedMean)^2
      weight = allData[i][1] - allData[i][0]; //(allData[i][1] - allData[i][0]) = uncertanty
      weightedMeanVariance += weight * ((allData[i][0] - weightedMean) * (allData[i][0] - weightedMean));
      sumOfWeights += weight;
    }
  }
  weightedMeanVariance = weightedMeanVariance / sumOfWeights;
  weightedMeanVariance = weightedMeanVariance * (allData.length / (allData.length - 1));
  return weightedMeanVariance;
}

//function returns the weighted mean uncertainty
//the argument allData should be an array returned directly from Data_Points_With_Uncertainty
//documentation on function implemented can be found here: http://seismo.berkeley.edu/~kirchner/Toolkits/Toolkit_12.pdf
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
function weighted_Mean_Uncertainty(allData) {
  var weightedMeanUncertanty = 0.0;
  if (allData && allData.length) {
    return Math.sqrt(weighted_Mean_Variance(allData) / allData.length);
  }
  return 0;
}

//function returns the expected value (average)
//FUNCTION IS CURRENTLY UNTESTED
function Expected_Value(data) {
  var sum = 0;
  var avg = 0;
  if (data.length) {
    var len = data.length;

    for (i = 0; i < len; i++) {
      sum += data[i][0];
    }
    avg = sum / len;
  }
  return avg;
}
//function reutrns the chi_squared of a dataset
//function uses Expected_Value(data)
//FUNCTION IS CURRENTLY UNTESTED
function chi_squared(data) {
  var chi = 0; //place holder for the chi-square value
  chi_sqr = new Array();
  var numerator = 0;
  var ev = Expected_Value(data); //expected value for data
  if (data.length) {
    for (i = 0; i < data.length; i++) {
      numerator = Math.pow(data[i][0], ev);
      chi_sqr[i] = numerator / ev;
    }
  }
  return chi_sqr;
}

//function will calculate the reduced chi squared of a dataset
//rejected = number of rejected datapoints
//fucntion uses Expected_Value(data)
//function uses chi_squared(data)
//FUNCTION IS CURRENTLY UNTESTED
function reduced_Chi_Squared(data, rejected) {
  var accepted = data.length - rejected; //accepted = degrees of freedom
  var reduced_chi_sqr = new Array();
  if (data && data.length) {
    var chi = chi_squared(data);
    for (i = 0; i < data.length; i++) {
      reduced_chi_sqr[i] = chi[i] / accepted;
    }
  }
  return reduced_chi_sqr;
}

function gaussian(t) {
  console.log("using gaussian");
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, -Math.pow(t, 2.0) / 2.0);
}

function epanechnikov(t) {
  console.log("using epanechnikov");
  return Math.max(0.0, ((3.0 / 4.0) * (1.0 - (1.0 / 5.0) * Math.pow(t, 2.0))) / Math.sqrt(5));
}

function sumKernel(bandwidth, allData, formulaGaussian, i) {
  var sumKernel = 0.0;
  var t = 0.0;
  if (allData && allData.length) {
    for (w = 0; w < allData.length; w++) {
      t = (i - allData[w][0]) / bandwidth;
      if (formulaGaussian) {
        sumKernel += gaussian(t);
      } else {
        sumKernel += epanechnikov(t);
      }
    }
  }

  return sumKernel;
}

function univariate_Kernel_Density(bandwidth, allData, formulaGaussian) {
  var densityEstimation = new Array();
  if (allData && allData.length) {
    for (i = 0; i < allData.length; i++) {
      densityEstimation[i] = (1 / (allData.length * bandwidth)) * sumKernel(bandwidth, allData, formulaGaussian, i);
    }
  }

  return densityEstimation;
}

function rejection(allData, rejection) {
  var rejection = new Array();
  if (allData) {
    for (i = 0; i < allData.length; i++) {
      if (i < 0) {
        rejection[i] = 0;
      } else {
        rejection[i] = 1;
      }
    }
  }
  return rejection;
}

function numberRejected(allData, rejection) {
  var count = 0;
  if (allData && rejection && allData.length) {
    var rejectionData = rejection(allData, rejection);
    for (i = 0; i < allData.length; i++) {
      if (rejectionData[i] == 1) {
        count++;
      }
    }
  }
  return count;
}

function SDsum(allData) {
  var standardDeviationSum = 0.0;
  var power = 0.0;
  if (allData && allData.length) {
    var mean = weighted_Mean(allData);
    for (i = 0; i < allData.length; i++) {
      power = allData[i][0] - mean;
      standardDeviationSum += Math.pow(power, 2);
    }
  }
  return standardDeviationSum;
}

function standardDeviation(allData, isPopulation) {
  var standardDeviation = 0.0;
  if (allData && allData.length) {
    if (isPopulation) {
      standardDeviation = Math.sqrt(SDsum(allData) / allData.length);
    } else {
      standardDeviation = Math.sqrt(SDsum(allData) / (allData.length - 1));
    }
  }
  return standardDeviation;
}

function differentNumbers(allData) {
  var oneOfEach = new Array();
  if (allData && allData.length) {
    oneOfEach[0] = allData[0][0];
    var isIn = false;
    for (i = 0; i < allData.length; i++) {
      isIn = false;
      for (z = 0; z < oneOfEach.length; z++) {
        if (allData[i][0] == oneOfEach[z]) {
          isIn = true;
        }
      }
      if (!isIn) {
        oneOfEach[i] = allData[i][0];
      }
    }
  }
  return oneOfEach;
}

function kernelMode(allData) {
  var largest = new Array();
  largestOne = 0;
  if (allData && allData.length) {
    var oneOfEach = differentNumbers(allData);
    for (z = 0; z < oneOfEach.length; z++) {
      largest[z] = 0;
    }
    for (i = 0; i < allData.length; i++) {
      for (z = 0; z < oneOfEach.length; z++) {
        if (oneOfEach[z] == allData[i][0]) {
          largest[z] += 1;
        }
      }
    }
    for (z = 0; z < oneOfEach.length; z++) {
      if (largest[z] > largestOne) {
        largestOne = z;
      }
    }
  }

  return largest[largestOne];
}

function kernelMedian(allData) {
  if (allData && allData.length) {
    if (allData.length === 0) return 0;
    allData.sort(sortFunction);
    var half = Math.floor(allData.length / 2);
    if (allData.length % 2) {
      return allData[half][0];
    } else {
      return (allData[half - 1][0] + allData[half][0]) / 2.0;
    }
  }
}

// Ascending sort on 1st column of 2D array
function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    return a[0] < b[0] ? -1 : 1;
  }
}

function kernelSkewness(allData, isMode, isPopulation) {
  var skewness = 0.0;
  var mean = weighted_Mean(allData);
  if (isMode) {
    skewness = (mean - kernelMode(allData)) / standardDeviation(allData, isPopulation);
  } else {
    skewness = (3 * (mean - kernelMedian(allData))) / standardDeviation(allData, isPopulation);
  }

  return skewness;
}
//function will get the labels based on the length of the data
//data is an array of data to be graphed
//OR
//if the user requires multiple datasets to be graphed data is an array of the
//largest data
//will return an array from 1 to the length of the data+1 in a step fashion of 1
function getLabels(data) {
  var labels = new Array();
  if (data.length) {
    for (i = 1; i < data.length + 1; i++) {
      labels.push(i);
    }
  }
  return labels;
}

//will check to see if multiple grpahs are selected to be graphed
//and will return the corresponding boolean value
function isMultipleCheck() {
  var inputs = document.getElementById("datasets");
  if (
    inputs.querySelectorAll("input[type=checkbox]:checked") &&
    inputs.querySelectorAll("input[type=checkbox]:checked").length
  ) {
    var checkboxes = inputs.querySelectorAll("input[type=checkbox]:checked").length;
    if (checkboxes == 1) {
      return false;
    } else {
      return true;
    }
  }
}

function dynamicGraph(iD) {
  if (document.getElementById(iD)) {
    var check = document.getElementById(iD);
    if (check.checked == true) {
      if (isMultipleCheck() == false) {
        var idNum = Number(iD.slice(-1));
        graphWeightedMean(idNum);
        graphKernelDensity(idNum);
        grapghReducedChiSquared(idNum);

        var allData = Data_Points_With_Uncertainty(
          getGraphableData(idNum),
          getGraphableUncertainty(idNum),
          eUncertainty
        );
        populateWeightedMeanGraphInfo(allData, idNum);
      } else {
        //alert("Please only select on dataset to graph");
        graphMultipleReducedChiSquared();
        graphMultipleKernelDensity();

        //check.checked = false;
      }
    } else if (isMultipleCheck() == false) {
      var checkId = getCheckedID();
      graphWeightedMean(checkId);
      graphKernelDensity(checkId);
      grapghReducedChiSquared(checkId);

      var allData = Data_Points_With_Uncertainty(
        getGraphableData(checkId),
        getGraphableUncertainty(checkId),
        eUncertainty
      );
      populateWeightedMeanGraphInfo(allData, checkId);
    }
  }
}

//function is called when a change in the state of a checkbox is determined
//function will take in the corresponding checkBox
//and call the appropriate functions to graph the data
function graph(input) {
  var iD = input.id;
  if (document.getElementById(iD)) {
    var check = document.getElementById(iD);
    if (check.checked == true) {
      if (isMultipleCheck() == false) {
        var idNum = Number(iD.slice(-1));
        graphWeightedMean(idNum);
        graphKernelDensity(idNum);
        grapghReducedChiSquared(idNum);

        var allData = Data_Points_With_Uncertainty(
          getGraphableData(idNum),
          getGraphableUncertainty(idNum),
          eUncertainty
        );
        populateWeightedMeanGraphInfo(allData, idNum);
      } else {
        //alert("Please only select on dataset to graph");
        graphMultipleReducedChiSquared();
        graphMultipleKernelDensity();
      }
    } else if (isMultipleCheck() == false) {
      var checkId = getCheckedID();
      graphWeightedMean(checkId);
      graphKernelDensity(checkId);
      grapghReducedChiSquared(checkId);

      var allData = Data_Points_With_Uncertainty(
        getGraphableData(checkId),
        getGraphableUncertainty(checkId),
        eUncertainty
      );
      populateWeightedMeanGraphInfo(allData, checkId);
    } else {
      var checkId = getCheckedID();
      graphWeightedMean(checkId);
      graphKernelDensity(checkId);
      grapghReducedChiSquared(checkId);

      var allData = Data_Points_With_Uncertainty(
        getGraphableData(checkId),
        getGraphableUncertainty(checkId),
        eUncertainty
      );
      populateWeightedMeanGraphInfo(allData, checkId);
    }
  }
}
function populateWeightedMeanGraphInfo(allData, id) {
  var count = 0;
  document.getElementById("textWeightedMean").innerHTML =
    "Weighted Mean: " + weighted_Mean(allData).toFixed(2) + " +/- " + weighted_Mean_Uncertainty(allData).toFixed(2);
  if (!isNaN(kernelSkewness(allData, false, false).toFixed(2))) {
    document.getElementById("textskewness").innerHTML = "Skewness: " + kernelSkewness(allData, false, false).toFixed(2);
  } else {
    document.getElementById("textskewness").innerHTML = "";
  }

  if (rejectedData[id - 1] && rejectedData[id - 1].length) {
    for (i = 0; i < rejectedData[id - 1].length; i++) {
      if (rejectedData[id - 1][i] != -1) {
        count += 1;
      }
    }
    if (allData && allData.length) {
      document.getElementById("textrejected").innerHTML =
        "Wtd by uncertainties (" + count + " of " + (allData.length + count) + " rejected)";
    } else {
      document.getElementById("textrejected").innerHTML =
        "Wtd by uncertainties (" +
        rejectedData[id - 1].length +
        " of " +
        (allData.length + rejectedData[id - 1].length) +
        " rejected)";
    }
  } else {
    document.getElementById("textrejected").innerHTML = "Wtd by uncertainties (0 of " + allData.length + " rejected)";
  }

  var currentSet = document.getElementById("set" + id).value;
  document.getElementById("textdataset").innerHTML = "Using: " + currentSet;
}

function exportGraphs() {
  var graphs = document.getElementById("graphs");
  var fileName = "graphs.png";
  domtoimage.toBlob(graphs).then(function (blob) {
    window.saveAs(blob, fileName);
  });
}

function getCheckedID() {
  var navData = document.getElementById("datasets");
  var check = 0;
  if (navData.querySelectorAll("input[type=checkbox]") && navData.querySelectorAll("input[type=checkbox]").length) {
    var numData = navData.querySelectorAll("input[type=checkbox]").length;
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i] !== undefined) {
        var iD = "checkdata" + (i + 1);
        if (document.getElementById(iD).checked == true) {
          check = i + 1;
        }
      }
    }
  }
  return check;
}
//function will return an array of the indexes of the datasets that are clicked
//to be graphed
function getCheckedDatasets() {
  var checkedArray = new Array();
  var datasetsIdNum = new Array();
  var navData = document.getElementById("datasets");
  if (navData.querySelectorAll("input[type=checkbox]") && navData.querySelectorAll("input[type=checkbox]").length) {
    var numData = navData.querySelectorAll("input[type=checkbox]").length;
    for (var j = 0; j < datasets.length; j++) {
      if (datasets[j] !== undefined) {
        datasetsIdNum.push(j + 1);
      }
    }
    for (var i = 0; i < datasetsIdNum.length; i++) {
      var iD = "checkdata" + datasetsIdNum[i];
      if (document.getElementById(iD).checked == true) {
        checkedArray.push(datasetsIdNum[i]);
      }
    }
  }
  return checkedArray;
}
//function will return the names of the dataset in an array format
//it is used to properly label the lines that are plotted for readabillity
function getCheckedDatasetsName() {
  var checkedArray = new Array();
  var datasetsIdNum = new Array();
  var navData = document.getElementById("datasets");
  if (navData.querySelectorAll("input[type=checkbox]") && navData.querySelectorAll("input[type=checkbox]").length) {
    var numData = navData.querySelectorAll("input[type=checkbox]").length + 1;
    for (var j = 0; j < datasets.length; j++) {
      if (datasets[j] !== undefined) {
        datasetsIdNum.push(j + 1);
      }
    }
    for (var i = 0; i < datasetsIdNum.length; i++) {
      var iD = "checkdata" + datasetsIdNum[i];
      if (document.getElementById(iD).checked == true) {
        var dataID = "Data Set " + (i + 1);
        checkedArray.push(dataID);
      }
    }
  }
  return checkedArray;
}

//function will find which dataset has the most data
//this is required to ensure all the data is displayed on the graphs
//when the user selects multiple datasets to plot
function getMaxDatasetLength(checked) {
  var maxCheck = checked[0];
  var first = 0;
  for (var i = 1; i < checked.length; i++) {
    if (datasets[checked[i - 1]].length > datasets[first]) {
      maxCheck = checked[i - 1];
    }
  }
  return maxCheck;
}

function graphMultipleReducedChiSquared() {
  var getChecked = getCheckedDatasets();
  var maxDataset = getMaxDatasetLength(getChecked);
  var dataLabels = getLabels(datasets[maxDataset]);
  var datasetsName = getCheckedDatasetsName();
  var graphData = new Array();
  for (var i = 0; i < getChecked.length; i++) {
    var allData = getGraphableData(Number(getChecked[i]));
    var allUnc = getGraphableUncertainty(Number(getChecked[i]));
    var tempdata = Data_Points_With_Uncertainty(allData, allUnc, eUncertainty);
    var tempChi = reduced_Chi_Squared(tempdata, 0);
    var labelData = "set" + getChecked[i];
    var tempX = {
      data: tempChi,
      label: document.getElementById(labelData).value,
      borderColor: colours[i],
      fill: false,
    };
    graphData.push(tempX);
  }
  var multiSqrContext = document.getElementById("rcSqr").getContext("2d");
  if (window.squareChart) {
    window.squareChart.destroy();
  }
  window.squareChart = new Chart(multiSqrContext, {
    type: "line",
    data: {
      labels: dataLabels,
      datasets: graphData,
    },
  });
}

function grapghReducedChiSquared(checked) {
  var tempDataset = getGraphableData(checked);
  var tempDataUncert = getGraphableUncertainty(checked);
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, eUncertainty);
  var dataLabels = getLabels(tempDataset);
  var rChiSquared = reduced_Chi_Squared(allData, 0);
  var sqrContext = document.getElementById("rcSqr").getContext("2d");
  if (window.squareChart) {
    window.squareChart.destroy();
  }
  window.squareChart = new Chart(sqrContext, {
    type: "line",
    data: {
      labels: dataLabels,
      datasets: [
        {
          data: rChiSquared,
          label: document.getElementById("set" + checked).value,
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
  });
}
//gets called if only oe dataset is selected to be graphed
function graphKernelDensity(checked) {
  var tempDataset = getGraphableData(checked);
  var tempDataUncert = getGraphableUncertainty(checked);
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, eUncertainty);
  var dataLabels = getLabels(tempDataset);
  var bandwidth = eBandwidth;
  var kernelData = new Array();
  var funct = eFunction;
  console.log("efunction = " + funct);
  if (funct == 1){
      kernelData = univariate_Kernel_Density(bandwidth, allData, true);
  }else{
    kernelData = univariate_Kernel_Density(bandwidth, allData, false);
  }
  var kernelContext = document.getElementById("kerDest").getContext("2d");
  if (window.kernelChart) {
    window.kernelChart.destroy();
  }
  window.kernelChart = new Chart(kernelContext, {
    type: "line",
    data: {
      labels: dataLabels,
      datasets: [
        {
          data: kernelData,
          label: document.getElementById("set" + checked).value,
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
  });
}

// Set all the values of an Array()
function setAll(a, v) {
  var i,
    n = a.length;
  for (i = 0; i < n; ++i) {
    a[i] = v;
  }
}
function getGraphableData(checked) {
  var tempDataset = datasets[checked - 1];
  var tempReject = rejectedData[checked - 1];
  var graphableData = new Array();
  if (tempReject == undefined) {
    for (j = 1; j < tempDataset.length; j++) {
      graphableData[j - 1] = tempDataset[j];
    }
    return graphableData;
  } else {
    for (i = 1; i < tempDataset.length; i++) {
      if (tempReject.includes(i) == false) {
        graphableData.push(tempDataset[i]);
      }
    }
    return graphableData;
  }
}

function getGraphableUncertainty(checked) {
  var tempDataset = datasetsUncer[checked - 1];
  var tempReject = rejectedData[checked - 1];
  var graphableData = new Array();
  if (tempReject == undefined) {
    for (j = 1; j < tempDataset.length; j++) {
      graphableData[j - 1] = tempDataset[j];
    }
    return graphableData;
  } else {
    for (i = 1; i < tempDataset.length; i++) {
      if (tempReject.includes(i) == false) {
        graphableData.push(tempDataset[i]);
      }
    }
    return graphableData;
  }
}
// Call if only one dataset is selected to be graphed
function graphWeightedMean(checked) {
  var tempDataset = getGraphableData(checked);
  var tempDataUncert = getGraphableUncertainty(checked);
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, eUncertainty);
  var dataLabels = getLabels(tempDataset);
  var weightedMeanAverage = weighted_Mean(allData);
  var weighteMeanArea = weighted_Mean_Uncertainty(allData);
  var weightedMeanAverageData = new Array(allData.length);
  var weightedMeanRangeData = new Array(allData.length);
  setAll(weightedMeanAverageData, weightedMeanAverage);
  for (var i = 0; i < weightedMeanRangeData.length; i++) {
    weightedMeanRangeData[i] = [allData[i][2], allData[i][1]];
  }
  var weightedMeanChartContext = document.getElementById("wMean").getContext("2d");
  if (window.weightedMeanChart) {
    window.weightedMeanChart.destroy();
  }
  window.weightedMeanChart = new Chart(weightedMeanChartContext, {
    type: "line",
    data: {
      labels: dataLabels,
      datasets: [
        {
          data: weightedMeanAverageData,
          label: "Mean",
          borderColor: "#3e95cd",
          lineThickness: weighteMeanArea,
          fill: false,
        },
        {
          data: weightedMeanRangeData,
          label: "Bar",
          type: "bar",
          backgroundColor: "#FF6633",
          barThickness: 10,
          maxBarThickness: 12,
        },
      ],
    },
  });
}

//function will graph data when multiple datasets are selected to be plotted
//uses a powerful external charting library called chart.js
function graphMultipleKernelDensity() {
  //gets an array of the datset numbers that are clicked
  var getChecked = getCheckedDatasets();
  var maxDataset = getMaxDatasetLength(getChecked);
  var dataLabels = getLabels(datasets[maxDataset]);
  var datasetsName = getCheckedDatasetsName();
  var bandwidth = eBandwidth;
  var graphData = new Array();
  for (var i = 0; i < getChecked.length; i++) {
    var allData = getGraphableData(Number(getChecked[i]));
    var allUnc = getGraphableUncertainty(Number(getChecked[i]));
    var tempdata = Data_Points_With_Uncertainty(allData, allUnc, eUncertainty);
    var funct = eFunction;
    var tempKer = univariate_Kernel_Density(bandwidth, tempdata, funct);
    var labelData = "set" + getChecked[i];
    var tempX = {
      data: tempKer,
      label: document.getElementById(labelData).value,
      borderColor: colours[i],
      fill: false,
    };
    graphData.push(tempX);
  }
  var multiKerContext = document.getElementById("kerDest").getContext("2d");
  if (window.kernelChart) {
    window.kernelChart.destroy();
  }
  window.kernelChart = new Chart(multiKerContext, {
    type: "line",
    data: {
      labels: dataLabels,
      datasets: graphData,
    },
  });
}

function center() {
  document.getElementById("screendivider").style.position = "relative";
  document.getElementById("collapsetop").style.height = "100%";
  document.getElementById("screendivider").style.top = "0vh";
  document.getElementById("tophalf").style.height = "325px";
  document.getElementById("table").style.height = "325px";
  document.getElementById("collapsebottom2").style.height = "54.5vh";
  document.getElementById("collapsebottom").style.height = "54.5vh";
  document.getElementById("collapsebottom3").style.height = "54.5vh";
  document.getElementById("btn1").style.backgroundColor = "#e07a5f";
  document.getElementById("btn2").style.backgroundColor = "#cd7158";
  document.getElementById("btn3").style.backgroundColor = "#e07a5f";
  return;
}

function expandTop() {
  document.getElementById("screendivider").style.position = "relative";
  document.getElementById("collapsebottom").style.height = "0px";
  document.getElementById("collapsebottom2").style.height = "0px";
  document.getElementById("collapsebottom3").style.height = "0px";
  document.getElementById("screendivider").style.top = "0px";
  document.getElementById("collapsetop").style.height = "89.3vh";
  document.getElementById("tophalf").style.height = "89.3vh";
  document.getElementById("table").style.height = "89.3vh";
  document.getElementById("btn1").style.backgroundColor = "#cd7158";
  document.getElementById("btn2").style.backgroundColor = "#e07a5f";
  document.getElementById("btn3").style.backgroundColor = "#e07a5f";
  return;
}

function expandBottom() {
  document.getElementById("collapsetop").style.height = "0px";
  document.getElementById("collapsebottom2").style.height = "89.3vh";
  document.getElementById("collapsebottom").style.height = "89.3vh";
  document.getElementById("collapsebottom3").style.height = "89.3vh";
  document.getElementById("btn1").style.backgroundColor = "#e07a5f";
  document.getElementById("btn2").style.backgroundColor = "#e07a5f";
  document.getElementById("btn3").style.backgroundColor = "#cd7158";
  return;
}

center();
updateEvaluationSettings(true);
