
//Sigma-Chi, written by Connor St. Louis - 2021

//GLOBAL VARS

//2D array storing arrays of each dataset entered
//index will correspond to the order that the datasets are listed
var datasets = new Array();

//2D array storing arrays of the corresponding dataset
//index will corrspond to the correct index of the datasets array
var datasetsUncer = new Array();

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

function updateEvaluationSettingsUncertainty(){
  var selectBox = document.getElementById("uncertaintySelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eUncertainty = selectedValue;
}

function updateEvaluationSettingsRejection(){
  var selectBox = document.getElementById("rejectionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eRejection = selectedValue;
}

function updateEvaluationSettingsData(){
  var selectBox = document.getElementById("dataSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eData = selectedValue;
}

function updateEvaluationSettingsWtdAvg(){
  var selectBox = document.getElementById("wtdAvgSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eWtdAvg = selectedValue;
}

function updateEvaluationSettingsFunction(){
  var selectBox = document.getElementById("functionSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eFunction = selectedValue;
}

function updateEvaluationSettingsBandwidth(){
  var selectBox = document.getElementById("bandwidthSelection");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  eFunction = selectedValue;
}

//this function will add a new row to table on button click
//FUNCTION IS CURRENTLY UNTESTED
function addRow(){
  var tbl = document.getElementById("tbl");
  var tbody = tbl.querySelector("tbody");
  var checkElem = tbody.querySelector('input');
  if (checkElem !== null){
    var inp = tbody.querySelectorAll('input[type="checkbox"]');
    var inpVal = tbody.querySelectorAll('input[type="number"]');
  }
  else{
    var inp = 0;
    var inpVal = 0;
  }

  if (inpVal > 0){
    var inpDataId = "dataInput" + (inpVal.length/2);
    var inpColId = "colInput" + (inpVal.length/2);
  }
  else{
    var inpDataId = "dataInput" + 1;
    var inpColId = "colInput" + 1;
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
  dataCol.className = "pt-3-half";
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("value", "");
  dataInput.setAttribute("id", inpDataId);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataCol.setAttribute("contenteditable", "true");
  dataInput.setAttribute("step", "0.01");

  uncCol.className = "pt-3-half";
  colInput.setAttribute("type", "number");
  colInput.setAttribute("value", "");
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
  colInput.setAttribute("step", "0.01");
  uncCol.setAttribute("contenteditable", "true");

  dataCol.appendChild(dataInput);
  uncCol.appendChild(colInput);

  newRow.appendChild(idCol);
  newRow.appendChild(rejCol);
  newRow.appendChild(dataCol);
  newRow.appendChild(uncCol);

  var checkBox = document.createElement("input");
  checkBox.className = "form-check-input text-center";
  checkBox.setAttribute("type", "checkbox");
  var numCheck = inp.length + 1;
  var id = "reject" + numCheck;
  checkBox.setAttribute("id", id);
  rejCol.appendChild(checkBox);

  var rowCount = tbody.getElementsByTagName("tr").length + 1;
  idCol.innerText = rowCount.toLocaleString();

  tbody.appendChild(newRow);
}

function addEmptyTableBody (){
  var tbl = document.getElementById("tbl");
  var numRows = tbl.querySelectorAll("tr").length;
  var tblBody = document.getElementById("tblBody");
  tblBody.innerHTML = "";
  if (numRows <= 1){
    for (var i = 0; i < 5; i++) {
      addRow();
    }
  }
}

function onDataChange (input){
  var newValue = Number(input.value);
  var inputId = input.id;
  //console.log(typeof inputId);
  var rowNum = Number(inputId.slice(-1));
  console.log(rowNum);
  var arr = datasets[tracker-1];
  console.log("Array :" +Array.isArray(arr));

  if (Array.isArray(arr)){
    datasets[tracker-1][0] = newValue;
    datasets[tracker-1][rowNum] = newValue;
    console.log("Array Update: ");
    console.log(datasets[tracker-1]);
  }
  else{
    var tempArray = new Array();
    tempArray[0] = newValue;
    tempArray[rowNum] = newValue;
    console.log("Temp Array: ");
    console.log(tempArray);
    datasets[tracker-1] = tempArray;
    console.log("Data Array: ");
    console.log(datasets[tracker-1]);
  }

}
function onColChange (input){
  var newValue = Number(input.value);
  var inputId = input.id;
  //console.log(typeof inputId);
  var rowNum = Number(inputId.slice(-1));
  console.log(rowNum);
  var arr = datasetsUncer[tracker];
  console.log("Array :" +Array.isArray(arr));

  if (Array.isArray(arr)){
    datasetsUncer[tracker-1][rowNum] = newValue;
    console.log("Array Update: ");
    console.log(datasetsUncer[tracker-1]);
  }
  else{
    var tempArray = new Array();
    tempArray[rowNum-1] = newValue;
    console.log("Temp Array: ");
    console.log(tempArray);
    datasetsUncer[tracker-1] = tempArray;
    console.log("Data Array: ");
    console.log(datasetsUncer[tracker-1]);
  }
}
function addRowWithData (data, uncert){
  var tbl = document.getElementById("tbl")
  var tbody = tbl.querySelector("tbody");
  console.log(tbody);
  var checkElem = tbody.querySelector('input');
  if (checkElem !== null){
    var inp = tbody.querySelectorAll('input[type="checkbox"]');
    var inpVal = tbody.querySelectorAll('input[type="number"]');
  }
  else{
    var inp = 0;
    var inpVal = 0;
  }
  if (inpVal > 1){
    var inpDataId = "dataInput" + (inpVal.length/2);
    var inpColId = "colInput" + (inpVal.length/2);
  }
  else{
    var inpDataId = "dataInput" + 1;
    var inpColId = "colInput" + 1;
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
  dataCol.setAttribute("contenteditable", "true");
  dataInput.setAttribute("type", "number");
  dataInput.setAttribute("id", inpDataId);
  dataInput.setAttribute("onchange", "onDataChange(this)");
  dataInput.setAttribute("step", "0.01");
  if (data !== undefined || data !== null){
    dataInput.setAttribute("value", data);
  }
  uncCol.className = "pt-3-half";
  uncCol.setAttribute("contenteditable", "true");
  colInput.setAttribute("type", "number");
  colInput.setAttribute("step", "0.01");
  colInput.setAttribute("id", inpColId);
  colInput.setAttribute("onchange", "onColChange(this)");
  if (uncert !== undefined || uncert !== null){
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
  var numCheck = inp.length + 1;
  var id = "reject" + numCheck;
  checkBox.setAttribute("id", id);
  rejCol.appendChild(checkBox);

  var rowCount = tbody.getElementsByTagName("tr").length + 1;
  idCol.innerText = rowCount.toLocaleString();

  tbody.appendChild(newRow);
}
function addTableBody (input){
  var data = datasets[input-1];
  var uncert = datasetsUncer[input-1];
  console.log("AddTableBody");
  console.log(data);
  console.log(uncert);
  var maxLength = Math.max(data.length, uncert.length);
  var getBody = document.getElementById("tblBody");
  getBody.innerHTML = "";
  for (var i = 1; i < maxLength; i++) {
    addRowWithData(data[i], uncert[i]);
  }
}
//function will retrieve all files inputted from clicking "Import"
//first reads in as a text string and then converts and updates
//global variables glData and glUncer
//need to modify to read into and array (global var)
//FUNCTION IS CURRENTLY UNTESTED
function dataFile(input){
  let file = input.files[0];
  var glData = new Array();
  var glUncer = new Array();
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function() {
    var splt = reader.result.trim().split("\n");
    console.log(splt);
    var fields = splt.splice(0,1);
    console.log(splt);
    console.log(fields);
    for (var i = 0; i < splt.length; i++) {
        var array = splt[i].split(",").map(Number);
        glData.push(array[0]);
        glUncer.push(array[1]);
    }
    console.log("Data : " + glData);
    console.log("Uncertainty : " + glUncer);
    addCSVTable(glData, glUncer);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}

//this function is called within dataFile() and stores the csv data
//into 2 global arrays: datasets and datasetsUncer. It uses 2 helper functions:
//addingDataset() will do the hard work in storing data
//addCSVTable() will update and dataset links to frontend
function addCSVTable (data, uncertainty){
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
function addingDataset (id,data, uncertainty){
  console.log("Id: " + id);
  console.log(typeof id);
  data.unshift(id);
  uncertainty.unshift(id);
  console.log("Data: " + data);
  console.log("Unc: " + uncertainty);
  datasets[id-1] = data;
  datasetsUncer[id-1] = uncertainty;
  console.log(datasets);
  console.log(datasetsUncer);
}

//function will get the data for the correspongding dataset
//a load it into a dynamic table
//function uses 2 helper funtions:
//addEmptyTableBody() which creates an empty dynamic table
//and
//addTableBody(input) which passes in the corresponing index
//that points to the dataset and creates the table with the data
function getData (input){
  //console.log("Index : " + input);
  //console.log("data getDat: " + datasets[input]);
  //console.log(typeof datasets[input]);
  var indexValue = typeof datasets[input - 1]
  tracker = input;
  console.log("Tracker : " + tracker);
  console.log(indexValue);
  if (indexValue == "undefined"){
    addEmptyTableBody();
    console.log("im in if");
  }
  else if (indexValue !== "undefined") {
    addTableBody(input);
    console.log("i'm in else if");
  }
}
//function will add new labels that represent additional DataSets
function addNewData (){
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
function Data_Points_With_Uncertainty(data, uncertainties, twosigma){
  if (data === undefined){
    alert("error using the current dataset");
    return null;
  } if (uncertainties === undefined){
    alert("error using the current uncertainties");
    return null;
  }

  var dataWithUncertainties = new Array();
  for (i = 0; i < data.length; i++) {
    if (twosigma == false){
      var uncertaintyMax = data[i] + (uncertainties[i] * 2);
      var uncertaintyMin = data[i] - (uncertainties[i] * 2);
    }else{
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
function weighted_Mean(allData){
  var weightedMean = 0.0;
  var sumOfWeights = 0.0;
  //for each data point
  for (i = 0; i < allData.length; i++){
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
function weighted_Mean_Variance(allData){
  var weightedMeanVariance = 0.0;
  var weight = 0.0;
  var sumOfWeights = 0.0;
  var weightedMean = weighted_Mean(allData);
  //for each data point
  for (i = 0; i < allData.length; i++){
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
function weighted_Mean_Uncertainty(allData){
  var weightedMeanUncertanty = 0.0;
  return Math.sqrt(weighted_Mean_Variance(allData) / allData.length);
}

//function returns the expected value (average)
//FUNCTION IS CURRENTLY UNTESTED
function Expected_Value(data){
  var sum = 0;
  var avg = 0;
  var len = data.length;
  for (i=0; i < len; i++){
    sum += data[i][0];
  }
  avg = sum/len;
  return avg;
}
//function reutrns the chi_squared of a dataset
//function uses Expected_Value(data)
//FUNCTION IS CURRENTLY UNTESTED
function chi_squared(data){
  var chi = 0; //place holder for the chi-square value
  chi_sqr = new Array();
  var numerator = 0;
  var ev = Expected_Value(data); //expected value for data

  for (i = 0; i < data.length; i++) {
    numerator = Math.pow(data[i][0],ev);
    chi_sqr[i] = numerator/ev;
  }
  return chi_sqr;
}

//function will calculate the reduced chi squared of a dataset
//rejected = number of rejected datapoints
//fucntion uses Expected_Value(data)
//function uses chi_squared(data)
//FUNCTION IS CURRENTLY UNTESTED
function reduced_Chai_Squared(data, rejected){
  var accepted = data.length - rejected;  //accepted = degrees of freedom
  var reduced_chi_sqr = new Array();
  var chi = chi_squared(data);
  for (i = 0; i < data.length; i++) {
    reduced_chi_sqr[i] = chi[i] / accepted;
  }
  return reduced_chi_sqr;
}

function gaussian(t){
  return 1.0 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -Math.pow(t, 2.0) / 2.0);
}

function epanechnikov(t){
  return Math.max(0.0, 3.0 / 4.0 * (1.0 - (1.0 / 5.0 * Math.pow(t, 2.0))) / Math.sqrt(5));
}

function sumKernel(bandwidth, allData, formulaGaussian, i){
  var sumKernel = 0.0;
  var t = 0.0;
  for (w = 0; w < allData.length; w++){
    t = (i - allData[w][0]) / bandwidth;
    if (formulaGaussian){
      sumKernel += gaussian(t);
    }else{
      sumKernel += epanechnikov(t);
    }
  }

  return sumKernel;
}

function univariate_Kernel_Density(bandwidth, allData, formulaGaussian){
  var densityEstimation = new Array();

  for (i = 0; i < allData.length; i++){
    densityEstimation[i] = ((1 / (allData.length * bandwidth)) * sumKernel(bandwidth, allData, formulaGaussian, i));
  }

  return densityEstimation;
}

function rejection(allData, rejection){
  var rejection = new Array();
  for (i = 0; i < allData.length; i++){
    if (i < 0){
      rejection[i] = 0;
    }else{
      rejection[i] = 1;
    }
  }
  return rejection;
}

function numberRejected(allData, rejection){
  var count = 0;
  var rejectionData = rejection(allData, rejection);
  for (i = 0; i < allData.length; i++){
    if (rejectionData[i] == 1){
      count++;
    }
  }
  return count;
}

function SDsum(allData){
  var standardDeviationSum = 0.0;
  var mean = weighted_Mean(allData);
  var power = 0.0;
  for (i = 0; i < allData.length; i++){
    power = allData[i] - mean;
    standardDeviationSum += Math.pow(power, 2);
  }
  return standardDeviationSum;
}

function standardDeviation(allData, isPopulation){
  var standardDeviation = 0.0;
  if(isPopulation){
    Math.sqrt(SDsum(allData) / allData.length);
  } else {
    Math.sqrt(SDsum(allData) / (allData.length - 1));
  }
  return standardDeviation;
}

function differentNumbers(allData){
  var oneOfEach = new Array();
  oneOfEach[0] = allData[0][0];
  var isIn = false;
  for (i = 0; i < allData.length; i++){
    isIn = false;
    for (z = 0; z < oneOfEach.length; z++){
      if (allData[i][0] == oneOfEach[z]){
        isIn = true;
      }
    }
    if (!isIn){
      oneOfEach[i] = allData[i][0];
    }
  }
  return oneOfEach;
}

function kernelMode(allData){
  var oneOfEach = differentNumbers(allData);
  var largest = new Array();
  largestOne = 0;
  for (z = 0; z < oneOfEach.length; z++){
    largest[z] = 0;
  }
  for (i = 0; i < allData.length; i++){
    for (z = 0; z < oneOfEach.length; z++){
      if (oneOfEach[z] == allData[i][0]){
        largest[z] += 1;
      }
    }
  }
  for (z = 0; z < oneOfEach.length; z++){
    if (largest[z] > largestOne){
      largestOne = z;
    }
  }
  return largest[largestOne];
}

function kernelMedian(allData){
  if(allData.length === 0) return 0;
    allData.sort(sortFunction);
    var half = Math.floor(allData.length / 2);
    if (allData.length % 2) {
      document.getElementById("kernelMedian").innerHTML = "Kernel Median: " + allData[half][0];
      return allData[half][0];
    }else {
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

function kernelSkewness(allData, isMode, isPopulation){
  var skewness = 0.0;
  var mean = weighted_Mean(allData);
  if (isMode){
    skewness = (mean - kernelMode(allData)) / standardDeviation(allData, isPopulation);
  } else {
    skewness = (3*(mean - kernelMedian(allData))) / standardDeviation(allData, isPopulation);
  }

  return skewness;
}

function csvTest() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}
//csvTest();
