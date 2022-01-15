module.exports = {
    Credentials: function(jsonObject){
        const self = this;
        self.jsonObject = jsonObject;
        self.twitchIrcToken = jsonObject.twitch_irc_oauth_token;
        self.twitchApiToken = jsonObject.twitch_api_oauth_token;
        self.twitchClientId = jsonObject.twitch_client_id;
        self.twitchClientSecret = jsonObject.twitch_client_secret;
        self.googleProjectId = jsonObject.google_project_id;
        self.twitchUsername = jsonObject.twitch_username;
        self.mongoConnectionString = jsonObject.mongo_connection_string;
    }
}