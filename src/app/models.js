module.exports = {
    ChannelConfiguration: function(document){
        const self = this;
        self.channelName = document.channelName;
        self.mode = document.mode;
        self.languages = document.languages;
        self.approvedUsers = document.approvedUsers;
        self.replyAs = document.replyAs;
        self.enabled = document.enabled;
        self.status = document.status;
        self.approvedWords = document.approvedWords;
        self.cacheDate = new Date();
    },
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
    },
    TwitchMessage: function(channel, messageContext, message, isThisBot){
        const self = this;
        self.channel = channel;
        self.messageContext = messageContext;
        self.message = message;
        self.isThisBot = isThisBot;

        self.messageId = self.messageContext.id;
        self.username = self.messageContext.username;
        self.isMod = self.messageContext.mod;
        self.isSubscriber = self.messageContext.subscriber;

        self.emoteOnly = self.messageContext["emote-only"] === true;

        self.badges = self.messageContext.badges === undefined ? {} : self.messageContext.badges;

        self.isBroadcaster = self.badges ? self.badges["broadcaster"] === "1" : false;
        self.isVip = self.badges ? self.badges["vip"] === "1" : false;
        self.isFounder = self.badges ? self.badges["founder"] === "1" : false;

        self.canRunModCommands = self.isMod === true || self.isBroadcaster === true;
    },
    CommandReply: function(shouldReply, text){
        const self = this;
        self.shouldReply = shouldReply;
        self.text = text;
    },
    ChatReply: function(shouldReply, text, sampledMessage, language, translation, debugText){
        const self = this;
        self.shouldReply = shouldReply;
        self.text = text;
        self.language = language;
        self.translation = translation;
        self.debugText = debugText;
        self.sampledMessage = sampledMessage;
    },
    TranslationResult: function(success, translations){
        const self = this;
        self.success = success;
        self.translations = translations;
        self.translation = self.translations[0].translatedText;
        self.detectedLanguage = self.translations[0].detectedLanguageCode;
    },
    DetectionResult: function(success, languages){
        const self = this;
        self.success = success;
        self.languages = languages;
        self.detectedLanguage = self.languageCodes[0].languageCode;
    }
};