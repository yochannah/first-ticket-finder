var request = require("request");

// Fetch all issues, based on the settings configured.
// Returns a promise, which will provide an array of issues
// if the promise is successful
function fetchPrs(settings) {
  return outerPromise = new Promise(function(resolve, reject) {
    var apiCalls = [];
    // One GitHub API call per tag in our settings.
    // Each call is saved in the apiCallls array so we can
    // Check when they're all resolved and return an answer to the user
    var theRepos = getRepos(settings).then(function(response) {

    response.map(function(repo) {
      var thisReposPrs = fetchOneReposPrs(repo.name,settings);
      apiCalls.push(thisReposPrs);
      });
    // once **all** of the GitHub api calls above are resolved, return the
    // responses to the user
    Promise.all(apiCalls).then(function(values) {
      //flatten all issues into one array
      var allIssues = [].concat.apply([],values);
      resolve(allIssues);
    });

  });

  });
}

// fetch issues for a single tag. Returns a promise that resolves when
// the result is ready.
var fetchOneReposPrs = function(repo, settings) {
  return innerPromise = new Promise(function(resolveInner, rejectInner) {
    var thisRepo = request(buildURL(repo, settings), (error, response, body) => {
      //return successful result body, OR
      if (response.statusCode == 200) {
        console.log("--- successfully fetched PRs for repo", repo, body.length);
        resolveInner(JSON.parse(body));
      //let people know if something went wrong.
      } else {
        console.log("response.statusCode", response.statusCode, response);
        rejectInner("Error fetching issues for repo " + repo);
      }
    });
  });
}


// build the url to fetch data for a given org, token, tag combo.
// docs for the GitHubb API: https://developer.github.com/v3/
// note we're also adding HTTP headers, particularly auth.
function buildURL(repo, settings) {
  var path = 'repos/' + settings.organisation + "/" + repo + '/pulls';
  console.log("Fetching prs for repo", repo);
  return {
    uri: 'https://api.github.com/' + path,
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": "token " + settings.access_token,
      "User-Agent": settings.organisation
    }
  };
}

function getRepos(settings){
  console.log("Fetching repos for", settings.organisation);
  var path = 'orgs/' + settings.organisation + '/repos'
  repoRequestSettings = {
    uri: 'https://api.github.com/' + path,
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": "token " + settings.access_token,
      "User-Agent": settings.organisation
    }
  };

  return innerPromise = new Promise(function(resolveInner, rejectInner) {
  var theRepos = request(repoRequestSettings, (error, response, body) => {
    //return successful result body, OR
    if (response.statusCode == 200) {
      console.log("--- successfully repos for", settings.organisation, body.length);
      resolveInner(JSON.parse(body));
    //let people know if something went wrong.
    } else {
      console.log("response.statusCode", response.statusCode, response);
      rejectInner("Error fetching repos for " + settings.organisation);
    }
  });
});
}

module.exports = fetchPrs;
