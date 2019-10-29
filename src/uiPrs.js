///////////////////////////////////////////////////////////
//this var is to keep track of the ids shown on the page
//so we don't show repeat issues if they have multiple tags
var added = [];

// thanks mozilla for helping me when I'm too lazy to write basic xhr code
//https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started

  var httpRequest;
  //this is where we call the api
  function makeRequest(server) {
    httpRequest = new XMLHttpRequest();
    //rudimentary error handling
    if (!httpRequest) {
      handleError("Error loading issues");
      return false;
    }
    httpRequest.onreadystatechange = handleResults;
    httpRequest.open('GET', server);
    httpRequest.send();
  }
  //cool. Let's go through all result we're given and add them
  // to the screen unless they're already present.
  function handleResults(event) {
    if (event.target.readyState === XMLHttpRequest.DONE) {
      if (event.target.status === 200) {
        printResults(JSON.parse(event.target.responseText))
      } else {
        handleError('There was a problem with the request.');
      }
    }
  }
  // given a set of results for a tag, generate html for each one
  // and add to our table.
  function printResults(results) {
    var table = document.getElementById('issues');
    table.innerHTML = "";
    results.map(function(result) {
      if (added.indexOf(result.id) < 0) {
        table.appendChild(formatResult(result));
        added.push(result.id);
      }
    });
  }

  // iterate over labels and make little tags for them.
  function labelsToHTML(labels, repo) {
    var response = "";
    labels.map(function(label){
      console.log("%clabels","color:turquoise;font-weight:bold;",label);
      response += "<span class='issue-label' style='border-color:#" + label.color + "'><a href='" + repo + "/labels/" + encodeURIComponent(label.name) + "'>" + label.name + "</a></span>"
    });
    return response;
  }

  //where the actual html generation mentioned above is done
  function formatResult(result) {
    var resultNode = document.createElement("tr");
    resultNode.classList.add("issue");
    //this is lazy but fast to write and sufficient for the job
    resultNode.innerHTML = "<td class='repo-language'>" + result.repository.language + "</td>" +
      "<td class='repo-name'> <a href='" + result.repository.html_url +
      "'>" + result.repository.name + "</a></td>" +
      "<td><a href='" + result.html_url + "'>" +
      result.title + "</a> </td>" +
      "<td ><div class='labels'>" + labelsToHTML(result.labels, result.repository.html_url) + "</div></td>";
    return resultNode;
  }

  //nothing could ever go wrong, but just in case. :D
  function handleError(errorText) {
    document.getElementById("errors").innerHTML += "<br>" + errorText;
  }

//UI template for the displayer
var template = '  <table class="tagGrabber">' +
  '<thead>' +
  '<tr>' +
  '<td>Repo&nbsp;language</td>' +
  '<td>Repo&nbsp;name</td>' +
  '<td>Issue</td>' +
  '<td>Labels</td>' +
  '</tr>' +
  '</thead>' +
  '<tbody id="issues">' +
  '<tr class="loader">' +
  '<td>' +
  'Loading issues.' +
  '<div class="logoloader">' +
  '<div class="left top"></div>' +
  '<div class="right top"></div>' +
  '<div class="left middle"></div>' +
  '<div class="right middle"></div>' +
  '<div class="left bottom"></div>' +
  '<div class="right bottom"></div>' +
  '</div>' +
  '</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<div id="errors"></div>';


//initialise UI component by running
OpenTagGrabber = {
  init: function(elementId,server) {
    var elem = document.getElementById(elementId);
    elem.innerHTML = template;
    makeRequest(server);
  }
}
