
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

//These are the global values in the Evaluations Pop up for backend to access. They are updated when a user selects an option. Default value 0 = No option selected
var eUncertainty = 0;
var eRejection = 0;
var eData = 0;
var eWtdAvg = 0;
var eFunction = 0;
var eBandwidth = 0;

//Global array for possible colours to use for grahping lines
var colours = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function updateEvaluationSettingsUncertainty() {
  var selectBox = document.getElementById("uncertaintySelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eUncertainty = selectedValue;
}

function updateEvaluationSettingsRejection() {
  var selectBox = document.getElementById("rejectionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eRejection = selectedValue;
}

function updateEvaluationSettingsData() {
  var selectBox = document.getElementById("dataSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eData = selectedValue;
}

function updateEvaluationSettingsWtdAvg() {
  var selectBox = document.getElementById("wtdAvgSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eWtdAvg = selectedValue;
}

function updateEvaluationSettingsFunction() {
  var selectBox = document.getElementById("functionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eFunction = selectedValue;
}

function updateEvaluationSettingsBandwidth() {
  var selectBox = document.getElementById("bandwidthSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eFunction = selectedValue;
}
//function will download data inputed in on a selected datatset as a csv file
//download will happen when the user clicks the download icon
function downloadData() {
  //setup data as an array of rows
  const rows = [["Data", "Uncertainty"]];
  var getDataset = datasets[tracker - 1];
  var getUncert = datasetsUncer[tracker - 1];
  for (var i = 1; i < getDataset.length + 1; i++) {
    rows.push([getDataset[i], getUncert[i]]);
  }
  //format the data into csv compatible format
  var csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function (rowArray) {
    var row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encode = encodeURI(csvContent);
  var fileName = "Data Set " + tracker + ".csv";
  //create a hidden download link and initiate a click
  var hiddenLink = document.createElement("a");
  hiddenLink.setAttribute("href", encode);
  hiddenLink.setAttribute("download", fileName);
  document.body.appendChild(hiddenLink);
  hiddenLink.click();
}
//this function will add a new row to table on button click
//FUNCTION IS CURRENTLY UNTESTED
function addRow() {
  var tbl = document.getElementById("tbl");
  var tbody = tbl.querySelector("tbody");
  var checkElem = tbody.querySelector('input');
  //check to see if table is empty
  if (checkElem !== null) {
    var inp = tbody.querySelectorAll('input[type="checkbox"]').length;
    var inpVal = (tbody.querySelectorAll('input[type="number"]').length) / 2;
  }
  else {
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

  idCol.className = "pt-3-half";
  rejCol.className = "pt-3-half";
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("value", "");
  var inpDataID = "dataInput" + (inpVal + 1);
  dataInput.setAttribute("id", inpDataID);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataCol.setAttribute("contenteditable", "false");
  dataInput.setAttribute("step", "0.01");

  uncCol.className = "pt-3-half";
  colInput.setAttribute("type", "number");
  colInput.setAttribute("value", "");
  var inpColId = "colInput" + (inpVal + 1);
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
  colInput.setAttribute("step", "0.01");
  uncCol.setAttribute("contenteditable", "false");

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
  if (rejectedData[tracker-1] !== undefined){
    if(rejectedData[tracker-1].includes(numCheck)){
      console.log('in rejected if');
      checkRejectedData(id);
    }
  }
}

//if no data has been added this fucntion will be called and then
//add a default of 5 rows
function addEmptyTableBody() {
  var tbl = document.getElementById("tbl");
  var numRows = tbl.querySelectorAll("tr").length;
  if (numRows <= 1) {
    for (var i = 0; i < 5; i++) {
      addRow();
    }
  }
}

function getRejectedData (idNum){
  var arr = rejectedData[tracker - 1]
  var id = "reject" + idNum;
  var checkBox = document.getElementById(id);
  if (checkBox.checked == true){
    if (Array.isArray(arr)){
      rejectedData[tracker - 1].push(idNum);
    }else{
      var tempArray = new Array();
      tempArray[0] = idNum;
      rejectedData[tracker - 1] = tempArray;
    }
  }
  else{
    if (Array.isArray(arr)){
      var data = rejectedData[tracker -1];
      if (data.includes(idNum)){
        var getIndex = data.indexOf(idNum);
        rejectedData.splice(getIndex, 1)
      }
    }
  }
  var dataID = "checkdata" + tracker;
  var checkBox = document.getElementById(dataID);
  if (checkBox.checked == true){
    dynamicGraph(dataID);
  }

}
//fucntion will be called when the software detects a change in
//the the data column of the table and will update the table with the new change
//input is the html element being passed in after change is made
function onDataChange(input) {
  var newValue = Number(input.value);
  var inputId = input.id;
  var rowNum = Number(inputId.slice(-1));
  var arr = datasets[tracker - 1];

  //determines is the data is already loaded into the gloabl array
  if (Array.isArray(arr)) {
    datasets[tracker - 1][0] = rowNum;
    datasets[tracker - 1][rowNum] = newValue;
  }
  else {
    var tempArray = new Array();
    tempArray[0] = rowNum;
    tempArray[rowNum] = newValue;
    datasets[tracker - 1] = tempArray;
  }

  var dataID = "checkdata" + tracker;
  var checkBox = document.getElementById(dataID);
  if (checkBox.checked == true){
    dynamicGraph(dataID);
  }

}
//function is called when a change is detected in the uncertainty table
//work in the exact same as onDataChange()
function onColChange(input) {
  var newValue = Number(input.value);
  var inputId = (input.id);
  var rowNum = Number(inputId.slice(-1));
  var arr = datasetsUncer[tracker - 1];

  if (Array.isArray(arr)) {
    datasetsUncer[tracker - 1][0] = newValue;
    datasetsUncer[tracker - 1][rowNum] = newValue;
  }
  else {
    var tempArray = new Array();
    tempArray[0] = newValue;
    tempArray[rowNum] = newValue;
    datasetsUncer[tracker - 1] = tempArray;
  }

  var dataID = "checkdata" + tracker;
  var checkBox = document.getElementById(dataID);
  if (checkBox.checked == true){
    dynamicGraph(dataID);
  }
}
//this function is called in sequence after the user imports a csv file
//this function will populate the table with the corresponding data
function addRowWithData(data, uncert) {
  var tbl = document.getElementById("tbl")
  var tbody = tbl.querySelector("tbody");
  var checkElem = tbody.querySelector('input');
  if (checkElem !== null) {
    var inp = tbody.querySelectorAll('input[type="checkbox"]').length;
    //because there are 2 input of this type
    var inpVal = (tbody.querySelectorAll('input[type="number"]').length) / 2;
  }
  else {
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

  idCol.className = "pt-3-half";
  rejCol.className = "pt-3-half";
  dataCol.className = "pt-3-half";
  dataCol.setAttribute("contenteditable", "false");
  var inpDataId = "dataInput" + (inpVal + 1);
  var inpColId = "colInput" + (inpVal + 1);
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("id", inpDataId);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataInput.setAttribute("step", "0.01");
  if (data !== undefined || data !== null) {
    dataInput.setAttribute("value", data);
  }
  uncCol.className = "pt-3-half";
  uncCol.setAttribute("contenteditable", "false");
  colInput.setAttribute("type", "number");
  colInput.setAttribute("step", "0.01");
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
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
  console.log("outside rejected if");
  console.log(rejectedData);
  if (rejectedData[tracker-1] !== undefined){
    if(rejectedData[tracker-1].includes(numCheck)){
      console.log('in rejected if');
      checkRejectedData(id);
    }
  }
}

function checkRejectedData(id){
  document.getElementById(id).checked = true;
}

//function will instantiate the table
function addTableBody(input) {
  var data = datasets[input - 1];
  var uncert = datasetsUncer[input - 1];
  var maxLength = Math.max(data.length, uncert.length);
  var getBody = document.getElementById("tblBody");
  getBody.innerHTML = "";
  for (var i = 1; i < maxLength + 1; i++) {
    addRowWithData(data[i], uncert[i]);
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
  var id = numDataSets + 1;
  addingDataset(id, data, uncertainty);
  addNewData();
}

//this function adds a dataset to the 2D array of daatsets to keep
//track of the number of datasets
//function takes 2 parameter data that is an array of data
//and uncertainty which is an array of uncertainties corrsponding to the
//respective data
function addingDataset(id, data, uncertainty) {
  data.unshift(id);
  uncertainty.unshift(id);
  datasets[id - 1] = data;
  datasetsUncer[id - 1] = uncertainty;
}

//function will get the data for the correspongding dataset
//a load it into a dynamic table
//function uses 2 helper funtions:
//addEmptyTableBody() which creates an empty dynamic table
//and
//addTableBody(input) which passes in the corresponing index
//that points to the dataset and creates the table with the data
function getData(input) {
  var indexValue = typeof datasets[input - 1]
  tracker = input;
  if (indexValue == "undefined") {
    var tblBody = document.getElementById("tblBody");
    tblBody.innerHTML = "";
    addEmptyTableBody();
  }
  else if (indexValue !== "undefined") {
    addTableBody(input);
  }
}
//function will add new labels that represent additional DataSets
function addNewData() {
  var div = document.getElementById("datasets");
  var numLabels = div.querySelectorAll("div").length + 1;

  var newDivData = document.createElement("div");
  newDivData.className = "data text-center";
  var divID = "data" + numLabels;
  var onclickFunc = "getData(" + numLabels + ")";
  newDivData.setAttribute("id", divID);
  newDivData.setAttribute("onclick", onclickFunc);

  var newLabel = document.createElement("label");
  var datasetID = "label" + numLabels
  newLabel.setAttribute("id", datasetID);

  var newCheckBox = document.createElement("input");
  newCheckBox.className = "text-center";
  newCheckBox.setAttribute("type", "checkbox");
  newCheckBox.setAttribute("onchange", "graph(this)");
  var checkboxID = "checkdata" + numLabels;
  newCheckBox.setAttribute("id", checkboxID);

  var dataText = "Data Set " + numLabels;
  newLabel.innerText = dataText;

  newDivData.appendChild(newLabel);
  newDivData.appendChild(newCheckBox);
  div.appendChild(newDivData);
}

//function input is data point values and uncertainties for each data point.
//the function returns an array in the form array[0] = new array (data point, uncertainty max, uncertainty min), array[1] = new array (data point 2, ........
//for example, if the customer enters 10, 1.  10 being the data point, 1 being the uncertainty, then array[0] = (10,11,9)
function Data_Points_With_Uncertainty(data, uncertainties, twosigma) {
  if (data === undefined) {
    alert("error using the current dataset");
    return null;
  } if (uncertainties === undefined) {
    alert("error using the current uncertainties");
    return null;
  }

  var dataWithUncertainties = new Array();
  for (i = 0; i < data.length; i++) {
    if (twosigma == false) {
      var uncertaintyMax = data[i] + (uncertainties[i] * 2);
      var uncertaintyMin = data[i] - (uncertainties[i] * 2);
    } else {
      var uncertaintyMax = data[i] + uncertainties[i];
      var uncertaintyMin = data[i] - uncertainties[i];
    }
    dataWithUncertainties[i] = new Array(data[i], uncertaintyMax, uncertaintyMin);
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
  for (i = 0; i < allData.length; i++) {
    //sum of all data points * their respective weights
    weightedMean += (allData[i][0] * (allData[i][1] - allData[i][0])); //(allData[i][1] - allData[i][0]) = uncertanty
    sumOfWeights += (allData[i][1] - allData[i][0]); //(allData[i][1] - allData[i][0]) = uncertanty
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
  var weightedMean = weighted_Mean(allData);
  //for each data point
  for (i = 0; i < allData.length; i++) {
    //w(x-weightedMean)^2
    weight = (allData[i][1] - allData[i][0]); //(allData[i][1] - allData[i][0]) = uncertanty
    weightedMeanVariance += (weight * ((allData[i][0] - weightedMean) * (allData[i][0] - weightedMean)));
    sumOfWeights += weight;
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
  return Math.sqrt(weighted_Mean_Variance(allData) / allData.length);
}

//function returns the expected value (average)
//FUNCTION IS CURRENTLY UNTESTED
function Expected_Value(data) {
  var sum = 0;
  var avg = 0;
  var len = data.length;
  for (i = 0; i < len; i++) {
    sum += data[i][0];
  }
  avg = sum / len;
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

  for (i = 0; i < data.length; i++) {
    numerator = Math.pow(data[i][0], ev);
    chi_sqr[i] = numerator / ev;
  }
  return chi_sqr;
}

//function will calculate the reduced chi squared of a dataset
//rejected = number of rejected datapoints
//fucntion uses Expected_Value(data)
//function uses chi_squared(data)
//FUNCTION IS CURRENTLY UNTESTED
function reduced_Chai_Squared(data, rejected) {
  var accepted = data.length - rejected;  //accepted = degrees of freedom
  var reduced_chi_sqr = new Array();
  var chi = chi_squared(data);
  for (i = 0; i < data.length; i++) {
    reduced_chi_sqr[i] = chi[i] / accepted;
  }
  return reduced_chi_sqr;
}

function gaussian(t) {
  return 1.0 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -Math.pow(t, 2.0) / 2.0);
}

function epanechnikov(t) {
  return Math.max(0.0, 3.0 / 4.0 * (1.0 - (1.0 / 5.0 * Math.pow(t, 2.0))) / Math.sqrt(5));
}

function sumKernel(bandwidth, allData, formulaGaussian, i) {
  var sumKernel = 0.0;
  var t = 0.0;
  for (w = 0; w < allData.length; w++) {
    t = (i - allData[w][0]) / bandwidth;
    if (formulaGaussian) {
      sumKernel += gaussian(t);
    } else {
      sumKernel += epanechnikov(t);
    }
  }

  return sumKernel;
}

function univariate_Kernel_Density(bandwidth, allData, formulaGaussian) {
  var densityEstimation = new Array();

  for (i = 0; i < allData.length; i++) {
    densityEstimation[i] = ((1 / (allData.length * bandwidth)) * sumKernel(bandwidth, allData, formulaGaussian, i));
  }

  return densityEstimation;
}

function rejection(allData, rejection) {
  var rejection = new Array();
  for (i = 0; i < allData.length; i++) {
    if (i < 0) {
      rejection[i] = 0;
    } else {
      rejection[i] = 1;
    }
  }
  return rejection;
}

function numberRejected(allData, rejection) {
  var count = 0;
  var rejectionData = rejection(allData, rejection);
  for (i = 0; i < allData.length; i++) {
    if (rejectionData[i] == 1) {
      count++;
    }
  }
  return count;
}

function SDsum(allData) {
  var standardDeviationSum = 0.0;
  var mean = weighted_Mean(allData);
  var power = 0.0;
  for (i = 0; i < allData.length; i++) {
    power = allData[i] - mean;
    standardDeviationSum += Math.pow(power, 2);
  }
  return standardDeviationSum;
}

function standardDeviation(allData, isPopulation) {
  var standardDeviation = 0.0;
  if (isPopulation) {
    Math.sqrt(SDsum(allData) / allData.length);
  } else {
    Math.sqrt(SDsum(allData) / (allData.length - 1));
  }
  return standardDeviation;
}

function differentNumbers(allData) {
  var oneOfEach = new Array();
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
  return oneOfEach;
}

function kernelMode(allData) {
  var oneOfEach = differentNumbers(allData);
  var largest = new Array();
  largestOne = 0;
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
  return largest[largestOne];
}

function kernelMedian(allData) {
  if (allData.length === 0) return 0;
  allData.sort(sortFunction);
  var half = Math.floor(allData.length / 2);
  if (allData.length % 2) {
    document.getElementById("kernelMedian").innerHTML = "Kernel Median: " + allData[half][0];
    return allData[half][0];
  } else {
    document.getElementById("kernelMedian").innerHTML = "Kernel Median: " + ((allData[half - 1][0] + allData[half][0]) / 2.0);
    return (allData[half - 1][0] + allData[half][0]) / 2.0;
  }
}

// Ascending sort on 1st column of 2D array
function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  else {
    return (a[0] < b[0]) ? - 1 : 1;
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
  for (i = 1; i < data.length + 1; i++) {
    labels.push(i);
  }
  return labels;
}
//will check to see if multiple grpahs are selected to be graphed
//and will return the corresponding boolean value
function isMUltipleCheck() {
  var inputs = document.getElementById("datasets");
  var checkboxes = inputs.querySelectorAll('input[type=checkbox]:checked').length;
  if (checkboxes == 1) {
    return false;
  }
  else {
    return true;
  }
}

function dynamicGraph(iD) {
  var check = document.getElementById(iD);
  if (check.checked == true) {
    console.log("Checkbox is Checked!!");
    if (isMUltipleCheck() == false) {
      var idNum = Number(iD.slice(-1));
      graphWeightedMean(idNum);
      graphKernelDensity(idNum);
      grapghReducedChiSquared(idNum);
    }
    else {
      //alert("Please only select on dataset to graph");
      graphMultipleReducedChiSquared();
      graphMultipleKernelDensity();
      //check.checked = false;
    }
  }
  else if (isMUltipleCheck() == false){
    var checkId = getCheckedID();
    graphWeightedMean(checkId);
    graphKernelDensity(checkId);
    grapghReducedChiSquared(checkId);
  }
}

//function is called when a change in the state of a checkbox is determined
//function will take in the corresponding checkBox
//and call the appropriate functions to graph the data
function graph(input) {
  var iD = input.id;
  var check = document.getElementById(iD);
  if (check.checked == true) {
    console.log("Checkbox is Checked!!");
    if (isMUltipleCheck() == false) {
      var idNum = Number(iD.slice(-1));
      graphWeightedMean(idNum);
      graphKernelDensity(idNum);
      grapghReducedChiSquared(idNum);
    }
    else {
      //alert("Please only select on dataset to graph");
      graphMultipleReducedChiSquared();
      graphMultipleKernelDensity();
      //check.checked = false;
    }
  }
  else if (isMUltipleCheck() == false){
    var checkId = getCheckedID();
    graphWeightedMean(checkId);
    graphKernelDensity(checkId);
    grapghReducedChiSquared(checkId);
  }
}

function getCheckedID (){
  var navData = document.getElementById("datasets");
  var numData = navData.querySelectorAll('input[type=checkbox]').length + 1;
  var check = 0;
  for (var i = 1; i < numData; i++) {
    var iD = "checkdata" + i
    if (document.getElementById(iD).checked == true) {
      check = i;
    }
  }
  return check;
}
//function will return an array of the indexes of the datasets that are clicked
//to be graphed
function getCheckedDatasets() {
  var checkedArray = new Array();
  var navData = document.getElementById("datasets");
  var numData = navData.querySelectorAll('input[type=checkbox]').length + 1;
  for (var i = 1; i < numData; i++) {
    var iD = "checkdata" + i
    if (document.getElementById(iD).checked == true) {
      checkedArray.push(i - 1);
    }
  }
  return checkedArray;
}
//function will return the names of the dataset in an array format
//it is used to properly label the lines that are plotted for readabillity
function getCheckedDatasetsName() {
  var checkedArray = new Array();
  var navData = document.getElementById("datasets");
  var numData = navData.querySelectorAll('input[type=checkbox]').length + 1;
  for (var i = 1; i < numData; i++) {
    var iD = "checkdata" + i
    if (document.getElementById(iD).checked == true) {
      checkedArray.push(iD);
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
    if (datasets[checked[i]].length > datasets[first]) {
      maxCheck = checked[i];
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
    var tempdata = Data_Points_With_Uncertainty(datasets[getChecked[i]], datasetsUncer[getChecked[i]], false);
    var tempChi = reduced_Chai_Squared(tempdata, 0);
    var tempX = {
      data: tempChi,
      label: datasetsName[i],
      borderColor: colours[i],
      fill: false
    };
    graphData.push(tempX);
  }
  var multiSqrContext = document.getElementById('rcSqr').getContext('2d');
  var squareChart = new Chart(multiSqrContext, {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: graphData
    }
  });

}
function grapghReducedChiSquared(checked) {
  var tempDataset = getGraphableData(checked);
  tempDataset.shift();
  var tempDataUncert = getGraphableUncertainty(checked);
  tempDataUncert.shift();
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, false);
  var dataLabels = getLabels(tempDataset);
  var rChiSquared = reduced_Chai_Squared(allData, 0);
  var sqrContext = document.getElementById('rcSqr').getContext('2d');
  var squareChart = new Chart(sqrContext, {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: [{
        data: rChiSquared,
        label: "Data Set" + checked,
        borderColor: "#3e95cd",
        fill: false
      }
      ]
    }
  });
}
//gets called if only oe dataset is selected to be graphed
function graphKernelDensity(checked) {
  var tempDataset = getGraphableData(checked);
  var tempDataUncert = getGraphableUncertainty(checked);
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, false);
  var dataLabels = getLabels(tempDataset);
  //console.log(dataLabels);
  var bandwidth = 0.8333333333333334;
  var kernelData = new Array();
  kernelData = univariate_Kernel_Density(bandwidth, allData, true);
  var kernelContext = document.getElementById('kerDest').getContext('2d');
  var kernelChart = new Chart(kernelContext, {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: [{
        data: kernelData,
        label: "Data Set " + checked,
        borderColor: "#3e95cd",
        fill: false
      }
      ]
    }
  });
}

// Set all the values of an Array()
function setAll(a, v) {
  var i, n = a.length;
  for (i = 0; i < n; ++i) {
      a[i] = v;
  }
}
function getGraphableData(checked){
  var tempDataset = datasets[checked - 1];
  var tempReject = rejectedData[checked - 1];
  console.log("in graphableData");
  console.log(tempReject);
  if (tempReject == undefined){
    //tempDataset.shift();
    console.log("in graphableData If state");
    console.log(tempDataset);
    return tempDataset;
  }else{
    var graphableData = new Array();
    for (i = 0; i < tempDataset.length; i++) {
      if (tempReject.includes(i) == false){
        console.log("in filter if statement")
        graphableData.push(tempDataset[i]);
      }
    }
    return graphableData;
  }
}

function getGraphableUncertainty(checked){
  var tempDataset = datasetsUncer[checked - 1];
  var tempReject = rejectedData[checked - 1];
  if (tempReject == undefined){
    //tempDataset.shift();
    return tempDataset;
  }else{
    var graphableData = new Array();
    for (i = 0; i < tempDataset.length; i++) {
      if (tempReject.includes(i) == false){
        graphableData.push(tempDataset[i]);
      }
    }
    return graphableData;
  };
}
// Call if only one dataset is selected to be graphed
function graphWeightedMean(checked) {
  var tempDataset = getGraphableData(checked);
  var tempDataUncert = getGraphableUncertainty(checked);
  var allData = Data_Points_With_Uncertainty(tempDataset, tempDataUncert, false);
  var dataLabels = getLabels(tempDataset);
  var weightedMeanAverage = weighted_Mean_Uncertainty(allData);
  var weightedMeanAverageData = new Array(allData.length - 1);
  var weightedMeanRangeData = new Array(allData.length - 1);
  setAll(weightedMeanAverageData, weightedMeanAverage);
  for (var i = 0; i < weightedMeanRangeData.length; i++) {
    weightedMeanRangeData[i] = [allData[i + 1][2], allData[i + 1][1]];
  }
  var weightedMeanChartContext = document.getElementById('wMean').getContext('2d');
  var weightedMeanChart = new Chart(weightedMeanChartContext, {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: [{
        data: weightedMeanAverageData,
        label: "Mean",
        borderColor: "#3e95cd",
        fill: false
      }, {
        data: weightedMeanRangeData,
        label: 'Bar',
        type: 'bar',
        backgroundColor: '#FF6633',
        barThickness: 10,
        maxBarThickness: 12
      }
      ]
    }
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
  var bandwidth = 0.8333333333333334;
  var graphData = new Array();
  for (var i = 0; i < getChecked.length; i++) {
    var tempdata = Data_Points_With_Uncertainty(datasets[getChecked[i]], datasetsUncer[getChecked[i]], false);
    var tempKer = univariate_Kernel_Density(bandwidth, tempdata, true);
    var tempX = {
      data: tempKer,
      label: datasetsName[i],
      borderColor: colours[i],
      fill: false
    };
    graphData.push(tempX);
  }
  var multiKerContext = document.getElementById('kerDest').getContext('2d');
  var squareChart = new Chart(multiKerContext, {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: graphData
    }
  });
}
