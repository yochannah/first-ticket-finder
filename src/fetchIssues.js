var request = require("request");

// Fetch all issues, based on the settings configured.
// Returns a promise, which will provide an array of issues
// if the promise is successful
function fetchIssues(settings) {
  return outerPromise = new Promise(function(resolve, reject) {
    var apiCalls = [];
    // One GitHub API call per tag in our settings.
    // Each call is saved in the apiCallls array so we can
    // Check when they're all resolved and return an answer to the user
    settings.tags.map(function(tag) {
      var thisTagsIssues = fetchOneTagsIssues(tag,settings);
      apiCalls.push(thisTagsIssues);
      });
    // once **all** of the GitHub api calls above are resolved, return the
    // responses to the user
    Promise.all(apiCalls).then(function(values) {
      //flatten all issues into one array
      var allIssues = [].concat.apply([],values);
      resolve(allIssues);
    });
  });
}

// fetch issues for a single tag. Returns a promise that resolves when
// the result is ready.
var fetchOneTagsIssues = function(tag, settings) {
  return innerPromise = new Promise(function(resolveInner, rejectInner) {
    var thisTag = request(buildURL(tag, settings), (error, response, body) => {
      //return successful result body, OR
      if (response.statusCode == 200) {
        console.log("--- successfully fetched tag", tag, body.length);
        resolveInner(JSON.parse(body));
      //let people know if something went wrong.
      } else {
        console.log("%cresponse.statusCode", response.statusCode);
        rejectInner("Error fetching issues for tag " + tag);
      }
    });
  });
}


// build the url to fetch data for a given org, token, tag combo.
// docs for the GitHubb API: https://developer.github.com/v3/
// note we're also adding HTTP headers, particularly auth.
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

module.exports = fetchIssues
