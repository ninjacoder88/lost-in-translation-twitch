// TODO: refactor?
const { CommandReply } = require("./models");

const langageLookup = {
    "en": "English",
    //"es": "Español",
    //"fr": "français",
    //"it": "Italiano"
}

module.exports = {
    NullCommand: function(){
        const self = this;
        self.isModCommand = false;
        
        self.executeAsync = async function(){
            return new CommandReply(false);
        }
    },
    TranslateCommand: function(){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            return new CommandReply(false);
        }
    },
    HelpCommand: function(){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            return new CommandReply(false);
        }
    },
    GetModeCommand: function(channelConfiguration){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            return new CommandReply(true, `litbot mode is ${channelConfiguration.mode}`);
        }
    },
    GetLanguageCommand: function(channelName, channelConfiguration){
        const self = this;
        self.isModCommand = false;

        self.executeAsync = async function(){
            const supportedLanguages = channelConfiguration.languages;
            if(supportedLanguages.length === 0){
                return new CommandReply(true, `${channelName} has no languages set`);
            }

            const supportLanguageNames = supportedLanguages.map(l => langageLookup[l]).join(", ");

            return new CommandReply(true, `${channelName} requires chat in the following languages only: ${supportLanguageNames}`);
        };
    },
    HelloCommand: function(){
        const self = this;
        self.isModCommand = false;

        self.executeAsync = async function(){
            return new CommandReply(true, "Hello, I am lost in translation bot a.k.a LITBOT. I am a bot that can help moderate and help chat be more inclusive by automatically translating chat that is in a language not used by the streamer.");
        };
    },
    SetModeCommand: function(channelName, changeTo, database){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            if(changeTo === "translate" || 
            changeTo === "moderate" || 
            changeTo === "off"){
                await database.setChannelModeAsync(channelName, changeTo);
                return new CommandReply(true, `litbot changed to '${changeTo}' mode`);
            }
            return new CommandReply(false);
        }
    },
    SetLanguageCommand: function(channelName, action, languageCode, database){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            if(action === "add"){
                if(!langageLookup[languageCode]){
                    return new CommandReply(true, `litbot does not currently support ${languageCode}`);
                }
    
                const languageName = langageLookup[languageCode];
                await database.addChannelLanguageAsync(channelName, languageCode);
                return new CommandReply(true, `${languageName} was successfully added`);
            }
    
            if(action === "remove"){
                const languageName = langageLookup[languageCode];
                await database.removeChannelLanguageAsync(channelName, languageCode);
                return new CommandReply(true, `${languageName} was successfully removed`);
            }

            return new CommandReply(false);
        };
    },
    SetUserCommand: function(channelName, action, username, database){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            if(action === "add"){
                await database.addApprovedUserAsync(channelName, username);
                return new CommandReply(true, `${username} was successfully added`);
            }

            if(action === "remove"){
                await database.removeApprovedUserAsync(channelName, username);
                return new CommandReply(true, `${username} was successfully removed`);
            }

            return new CommandReply(false);
        };
    },
    SetReplyAsCommand: function(channelName, action, database){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            if(action === "chat"){
                await database.setReplyAsAsync(channelName, "chat");
                return new CommandReply(true, `litbot will now reply in chat`);
            }
            if(action === "whisper"){
                await database.setReplyAsAsync(channelName, "whisper");
                return new CommandReply(true, `litbot will now reply as whisper`);
            }
            return new CommandReply(false);
        };
    },
    SetWordCommand: function(channelName, action, word, database){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            if(action === "add"){
                await database.addApprovedWordAsync(channelName, word);
                return new CommandReply(true, `${word} was successfully added`);
            }

            if(action === "remove"){
                await database.removeApprovedWordAsync(channelName, word);
                return new CommandReply(true, `${word} was successfully removed`);
            }

            return new CommandReply(false);
        };
    }
}