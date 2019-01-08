var fetchIssues = require("./fetchIssues.js");
var settings = require("../settings.js");

var appRouter = function (app) {
  app.get("/", function(req, res) {

    fetchIssues(settings).then(function(response){
      console.log("#$#$#$#$#$#$#$#$#$#$#$#$#$#$",response.length);
      res.status(200).send(response);
    });
  });
}

module.exports = appRouter;
