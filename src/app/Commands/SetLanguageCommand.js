const { CommandReply } = require("../Models/CommandReply");

const langageLookup = {
    "en": "English",
    //"es": "Español",
    //"fr": "français",
    //"it": "Italiano"
}

module.exports = {
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
    }
}