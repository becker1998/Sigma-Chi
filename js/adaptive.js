// This JavaScript file handles the mobile version of the app.
// When the screen width reaches mobile dimensions, the phone app is rendered
// instead of the desktop app. This method is used on top of responsive design
// due to layout refactoring required at smaller widths.

window.onresize = function(event) {
  document.location.reload(true);
}

var href = window.location.href.split("/")
var html_location = href[href.length-1]

//console.log(window.innerWidth);

// LOAD DESKTOP
if (document.documentElement.clientWidth >= 450 && (html_location !== "Index.html" || html_location !== "mobileIndex.html") ) {
    window.location = "home.html";
}

else if (document.documentElement.clientWidth >= 450 && (html_location !== "home.html" || html_location !== "mobileIndex.html") ) {
    window.location = "index.html";
}

// LOAD MOBILE (iPhone 12 Pro Max width = 428)
if (document.documentElement.clientWidth < 450 && html_location !== "mobileIndex.html") {
    window.location = "mobileIndex.html";
}
