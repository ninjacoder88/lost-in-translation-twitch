# Lost In Translation Bot
A Twitch bot that translates chat to a language of the streamers choice

# To Do
- [ ] set option to whisper translations instead of post to chat
- [ ] add support for help command
- [ ] add support for translate command

# Commands
All commands are triggered by !litbot

### Mods Only
- _help_ - whispers the bot commands (IN DEVELOPMENT)
- _translate_ - translates the text following into streamers language (IN DEVELOPMENT)
- _mode_ - display the current mode in chat
- _mode MODE_ - changes the bot mode to MODE
- _lang add LANG_ - adds LANG to list of approved langages for channel where lang is ISO 639-1 code
- _lang remove LANG_ - removes LANG from list of approved languages for channel where LANG is ISO 639-1 code
- _user add USER_ - adds USER to list of approved users
- _user remove USER_ - removes USER from list of approved users

### All Users
- _lang_ - post the approved langagues to chat
- _hello_ - tells you what litbot is

# Modes
- **Translate** - translate mode will detect any messages not in the streamers preferred languages and translate them to the first listed approved language
- **Moderate** - moderate mode will detect any messages not in the streamers preferred lanaguage and delete them from chat

# Approved Users
Approved users is a list of users that are ignored by litbot

# Dependencies
- twitch chat IRC
- Google Translate API

# Documentation
- https://dev.twitch.tv/docs/irc
- https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
- https://stackoverflow.com/questions/42043611/could-not-load-the-default-credentials-node-js-google-compute-engine-tutorial
- https://cloud.google.com/translate/docs/reference/rest/v3/projects
- https://docs.mongodb.com/drivers/node/current/usage-examples/
- https://github.com/nodesource/distributions/blob/master/README.md#debinstall
- https://blog.eduonix.com/web-programming-tutorials/deploy-node-js-application-linux-server/
- https://cloud.google.com/sdk/docs/install#deb
- https://phoenixnap.com/kb/generate-ssh-key-windows-10

# Server Setup
- Setup SSH Key (on Windows)
  - In powershell run `ssh-keygen`
  - Select the filepath to save
  - Enter _passphrase_
- SSH into server (from Windows)
  - `ssh -o "IdentitiesOnly=yes" -i c:\users\XXXX\.ssh\YYYY user@ZZZ.ZZZ.ZZZ.ZZZ`
  - Enter _passphrase_
- Run command on server
  - `curl -fsSL https://deb.nodesource.com/setup_14.x | bash -`
  - `apt-get install -y nodejs`
  - In the directory where you want to run your app from `mkdir litbot`
  - `cd litbot`
  - `npm install tmi.js`
  - `npm install mongodb`
  - `npm install --save @google-cloud/translate`
  - `sudo apt-get install apt-transport-https ca-certificates gnupg`
  - `echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list`
  - `curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -`
  - `sudo apt-get update && sudo apt-get install google-cloud-sdk`
  - `gcloud init`
  - `gcloud auth application-default login`
- Copy file to server
  - Copy private key from google service account
  - Copy litbot-credentials.json