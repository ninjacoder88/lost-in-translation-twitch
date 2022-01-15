const { NullCommand } = require("../Commands/NullCommand");
const { TranslateCommand } = require("../Commands/TranslateCommand");
const { HelpCommand } = require("../Commands/HelpCommand");
const { GetModeCommand } = require("../Commands/GetModeCommand");
const { GetLanguageCommand } = require("../Commands/GetLanguageCommand");
const { SetModeCommand } = require("../Commands/SetModeCommand");
const { SetLanguageCommand } = require("../Commands/SetLanguageCommand");
const { SetUserCommand } = require("../Commands/SetUserCommand");
const { SetReplyAsCommand } = require("../Commands/SetReplyAsCommand");
const { HelloCommand } = require("../Commands/HelloCommand");
const { SetWordCommand } = require("../Commands/SetWordCommand");

module.exports = {
    BotCommandFactory: function(databaseProxy){
        const self = this;
        const database = databaseProxy;

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
            // !litbot hello
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
                    case "hello":
                        return new HelloCommand();
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
            // !litbot word add XYZ
            if(splitMessageLength === 4){
                const action = splitMessage[1];
    
                switch(action){
                    case "lang":
                        return new SetLanguageCommand(twitchMessage.channel, splitMessage[2], splitMessage[3], database);
                    case "user":
                        return new SetUserCommand(twitchMessage.channel, splitMessage[2], splitMessage[3], database);
                    case "word":
                        return new SetWordCommand(twitchMessage.channel, splitMessage[2], splitMessage[3], database);
                    default:
                        return new NullCommand();
                }
            }

            return new NullCommand();
        }
    }
}