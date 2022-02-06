const {IgnoreChatAction} = require("../ChatActions/IgnoreChatAction");
const {ModerateChatAction} = require("../ChatActions/ModerateChatAction");
const {TranslateChatAction} = require("../ChatActions/TranslateChatAction");

module.exports = {
    ChatActionFactory: function(translationClientProxy, messageSanitizer){
        const self = this;

        self.provideChatAction = function(twitchMessage, channelConfiguration){
            if(channelConfiguration.mode === "off"){
                return new IgnoreChatAction("mode is off");
            }

            const translateUser = channelConfiguration.translateUsers.indexOf(twitchMessage.username) !== -1;

            if(twitchMessage.isMod === true && translateUser === false){
                return new IgnoreChatAction("chat by mod");
            }

            if(twitchMessage.isBroadcaster === true && translateUser === false){
                return new IgnoreChatAction("chat by broadcaster");
            }

            if(twitchMessage.isSubscriber === true && translateUser === false){
                return new IgnoreChatAction("chat by subscriber");
            }

            if(twitchMessage.isVip === true && translateUser === false){
                return new IgnoreChatAction("chat by vip");
            }

            if(twitchMessage.isFounder === true && translateUser === false){
                return new IgnoreChatAction("chat by founder");
            }

            const approvedUser = channelConfiguration.approvedUsers.indexOf(twitchMessage.username) !== -1;

            if(approvedUser === true && translateUser === false){
                return new IgnoreChatAction("chat by approved user");
            }

            if(channelConfiguration.languages.length === 0){
                return new IgnoreChatAction("no configured languages");
            }

            if(twitchMessage.emoteOnly === true){
                return new IgnoreChatAction("emotes only");
            }

            const messageWithoutEmotes = messageSanitizer.removeEmotes(twitchMessage);
            const lowercaseMessageWithoutEmotes = messageWithoutEmotes.toLowerCase();

            if(messageWithoutEmotes.length === 0){
                return new IgnoreChatAction("no message without emotes");
            }

            const filteredMessage = messageSanitizer.removeApprovedWords(lowercaseMessageWithoutEmotes, channelConfiguration.approvedWords);

            if(filteredMessage.trim().length === 0){
                return new IgnoreChatAction("empty message without exclusions");
            }

            if(channelConfiguration.mode === "translate"){
                return new TranslateChatAction(filteredMessage, twitchMessage.username, channelConfiguration, translationClientProxy);
            }

            if(channelConfiguration.mode === "moderate"){
                return new ModerateChatAction(filteredMessage, twitchMessage.messageId, channelConfiguration, translationClientProxy);
            }

            return new IgnoreChatAction("unknown mode");
        }
    }
}