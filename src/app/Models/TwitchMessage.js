module.exports = {
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
        self.emotes = self.messageContext.emotes;

        self.emoteOnly = self.messageContext["emote-only"] === true;

        self.badges = self.messageContext.badges === undefined ? {} : self.messageContext.badges;

        self.isBroadcaster = self.badges ? self.badges["broadcaster"] === "1" : false;
        self.isVip = self.badges ? self.badges["vip"] === "1" : false;
        self.isFounder = self.badges ? self.badges["founder"] === "1" : false;

        self.canRunModCommands = self.isMod === true || self.isBroadcaster === true;
    }
}