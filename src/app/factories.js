// TODO: refactor?
const { NullCommand, TranslateCommand, HelpCommand, GetModeCommand, 
    GetLanguageCommand, SetModeCommand, SetLanguageCommand, 
    SetUserCommand, SetReplyAsCommand } = require("./commands");
const { IgnoreChatAction, TranslateChatAction, ModerateChatAction } = require("./chatActions");

module.exports = {
    BotCommandFactory: function(database){
        const self = this;

        self.provideCommand = function(twitchMessage, channelConfiguration){
            const formattedMessage = twitchMessage.message.toLowerCase().trim();

            if(formattedMessage.startsWith("!litbot") === false){
                return undefined;
            }

            const splitMessage = formattedMessage.split(" ");
    
            if(splitMessage[0] !== "!litbot"){
                return new NullCommand();
            }
    
            const splitMessageLength = splitMessage.length;
    
            // !litbot mode
            // !litbot lang
            // !litbot help
            // !litbot translate
            if(splitMessageLength === 2){
                const action = splitMessage[1];
    
                switch(action){
                     case "translate": //need to get rest of message as params
                        return new TranslateCommand();
                    case "help":
                        return new HelpCommand();
                    case "mode": 
                        return new GetModeCommand(channelConfiguration);
                    case "lang":
                        return new GetLanguageCommand(twitchMessage.channel, channelConfiguration);
                    default:
                        return new NullCommand();
                }
            }

            // !litbot mode translate
            // !litbot mode moderate
            // !litbot mode off
            // !litbot replyas chat
            // !litbot replyas whisper
            if(splitMessageLength === 3){
                const action = splitMessage[1];
    
                switch(action){
                    case "mode": 
                        return new SetModeCommand(twitchMessage.channel, splitMessage[2], database);
                    case "reply":
                        return new SetReplyAsCommand(twitchMessage.channel, splitMessage[2], database);
                    default:
                        return new NullCommand();
                }
            }
    
            // !litbot lang add en
            // !litbot lang remove en
            // !litbot user add username
            // !litbot user remove username
            if(splitMessageLength === 4){
                const action = splitMessage[1];
    
                switch(action){
                    case "lang":
                        return new SetLanguageCommand(twitchMessage.channel, splitMessage[2], splitMessage[3], database);
                    case "user":
                        return new SetUserCommand(twitchMessage.channel, splitMessage[2], splitMessage[3], database);
                    default:
                        return new NullCommand();
                }
            }

            return new NullCommand();
        }
    },
    ChatActionFactory: function(translationClientProxy){
        const self = this;
        const exclusions = ["delirya", "lul"];

        const filterArray = (arr1, arr2) => {
            const filtered = arr1.filter(el => {
               return arr2.indexOf(el) === -1;
            });
            return filtered;
         };

        self.provideChatAction = function(twitchMessage, channelConfiguration){
            if(channelConfiguration.mode === "off"){
                return new IgnoreChatAction("mode is off");
            }

            if(twitchMessage.isMod === true){
                return new IgnoreChatAction("chat by mod");
            }

            if(twitchMessage.isBroadcaster === true){
                return new IgnoreChatAction("chat by broadcaster");
            }

            if(twitchMessage.isSubscriber === true){
                return new IgnoreChatAction("chat by subscriber");
            }

            if(twitchMessage.isVip === true){
                return new IgnoreChatAction("chat by vip");
            }

            if(twitchMessage.isFounder === true){
                return new IgnoreChatAction("chat by counder");
            }

            if(channelConfiguration.approvedUsers.indexOf(twitchMessage.username) !== -1){
                return new IgnoreChatAction("chat by approved user");
            }

            if(channelConfiguration.languages.length === 0){
                return new IgnoreChatAction("no configured languages");
            }

            if(twitchMessage.message.startsWith("http://") || twitchMessage.message.startsWith("https://")){
                return new IgnoreChatAction("url");
            }

            if(twitchMessage.emoteOnly === true){
                return new IgnoreChatAction("emotes only");
            }

            if(twitchMessage.messageWithoutEmotes.trim().length === 0){
                return new IgnoreChatAction("empty message without emotes");
            }

            const splitMessage = twitchMessage.messageWithoutEmotes.toLowerCase().split(" ");
            const filteredMessage = filterArray(splitMessage, exclusions).join(" ");

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