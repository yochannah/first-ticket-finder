/*
In order for this to work you MUST set a token. You probably want to set
an organisation and tags as well to suit you.
=================================

1. Get a token.

Where do tokens come from?
See here: https://github.com/blog/1509-personal-api-tokens
Note: you only need public_repo permissions for this tiny app to work.

=================================

2. Set env vars.

To set the vars on a Mac or Linux environment, run something like this in your terminal,
but replace everything after the = sign with your own content. No spaces allowed.

EXPORT TAG_GRABBER_ACCESS_TOKEN=1234356647856878
EXPORT TAG_GRABBER_TAGS=help%20wanted,tag2,tag3 (NOTE: NO SPACE BETWEEN TAGS - use %20 if space is needed in a tag)
EXPORT TAG_GRABBER_ORG=yourgithuborghere

=================================
3. If the env vars aren't playing nice....

If you prefer, you _can_ set them simply by editing this file, e.g. for const token = `PUT YOUR TOKEN HERE` - but don't commit it to git, please! :)
*/

var tags = process.env.TAG_GRABBER_TAGS;
// only try to split tags if they're defined as a variable.
// otherwise it throws an error. 
if (tags) {
  tags = process.env.TAG_GRABBER_TAGS.split(",")
}

const token = process.env.TAG_GRABBER_ACCESS_TOKEN;
const settings = {
  "tags": tags || ["beginner", "first-timers-only", "good%20first%20bug", "help%20wanted"],
  "organisation": process.env.TAG_GRABBER_ORG || "intermine",
  "access_token": token
}

module.exports = settings;
