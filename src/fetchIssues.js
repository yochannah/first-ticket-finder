var request = require("request");

function fetchIssues(settings) {
  return outerPromise = new Promise(function(resolve, reject) {

    var apiCalls = [];

    settings.tags.map(function(tag) {
      var thisTagsIssues = fetchOneTagsIssues(tag,settings);
      apiCalls.push(thisTagsIssues);
      });
    //once all of the api calls to get issues are resolved, return the responses
    // to the user
    Promise.all(apiCalls).then(function(values) {
      //flatten all issues into one array
      var allIssues = [].concat.apply([],values);
      resolve(allIssues);
    });
  });
}

var fetchOneTagsIssues = function(tag, settings) {
  return innerPromise = new Promise(function(resolveInner, rejectInner) {

    var thisTag = request(buildURL(tag, settings), (error, response, body) => {

      if (response.statusCode == 200) {
        console.log("-successfully fetched tag", tag, body.length);
        resolveInner(JSON.parse(body));
      } else {
        console.log("%cresponse.statusCode", response.statusCode);
        rejectInner("Error fetching issues for tag " + tag);
      }
    });
  });
}


//build the url to fetch data for a given org, token, tag combo.
function buildURL(tag, settings) {
  var path = 'orgs/' + settings.organisation +
    '/issues' +
    '?filter=all&labels=' +
    tag + '&state=open';
  console.log("Fetching issues tagged with ", path);
  return {
    uri: 'https://api.github.com/' + path,
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": "token " + settings.access_token,
      "User-Agent": settings.organisation
    }
  };
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

module.exports = fetchIssues
