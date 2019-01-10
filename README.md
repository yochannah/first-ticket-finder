[![npm version](https://badge.fury.io/js/first-ticket-finder.svg)](https://badge.fury.io/js/first-ticket-finder)

# Issue finder

This allows an organisation using GitHub to collate "help wanted" style issues easily. It comprises of two parts - a server to fetch the issues, and a UI component to output the issues in a table.

## Initialising the server component

### Configuring your server
The server is necessary (rather than accessing the GitHub API from a static file) in order to keep your GitHub token secure. You'll need to configure a few settings in order to initialise and run the server. See [settings.js](settings.js) for the config required. You're able to choose which GitHub tags to visualise for your organisation in this file.

### Hosting your server.
This app is configured to run on a service like docker or dokku automatically. To run it locally, run

```bash
npm start
```

If you haven't configured your GitHub token (the previous step) this will not work.

You can then see the json for all your issues at localhost:3000/issues and you can view the UI for the issues at localhost:3000 (or whatever port you've configured).

## Embedding the UI component

If you'd like to show these issues in a single snazzy UI component embedded somewhere else, perhaps on your webpage or documentation site, you can simply run the server somewhere that is convenient for you and initialise the component like so:

```html
<!-- Include stylesheet -->
<link rel="stylesheet" type="text/css" href="style.css" />

<!-- Include a link to ui.js-->
<script src="src/ui.js">
</script>

<!-- create a div to populate with issues -->
<div id="intermineIssues"></div>

<script>
<!-- initialise the component and pass it the id of the div you created,
     plus the URL or path to the issues server. -->
  OpenTagGrabber.init("intermineIssues","/issues");
</script>

```

### Developing

Requirements: Node, npm. Run npm install to initialise the repo and install the few dependencies.

Building the less into css: install lessc, then run `lessc style.less style.css`
