
//Sigma-Chi, written by Connor St. Louis - 2021

//function input is data point values and uncertainties for each data point.
//the function returns an array in the form array[0] = new array (data point, uncertainty max, uncertainty min), array[1] = new array (data point 2, ........
//for example, if the customer enters 10, 1.  10 being the data point, 1 being the uncertainty, then array[0] = (10,11,9)
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
//THIS FUNCTION IS CURRENTLY UNTESTED
function Data_Points_With_Uncertainty(data, uncertainties){
  if (data === undefined){
    alert("error using the current dataset");
    return null;
  } if (uncertainties === undefined){
    alert("error using the current uncertainties");
    return null;
  }

  var dataWithUncertanties = new Array();
  for (i = 0; i < data.length; i++) {
    var uncertantyMax = data[i] + uncertanties[i];
    var uncertantyMin = data[i] - uncertanties[i];
    dataWithUncertanties[i] = new Array(data[i], uncertantyMax, uncertantyMin);
  }
  return dataWithUncertanties;
}

function weighted_Mean(){
  alert("Hello World");
}

function reduced_Chai_Squared(){
  alert("Hello World");
}

function univariate_Kernel_Density(){
  alert("Hello World");

}
