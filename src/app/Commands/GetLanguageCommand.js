const { CommandReply } = require("../Models/CommandReply");

const langageLookup = {
    "en": "English",
    //"es": "Español",
    //"fr": "français",
    //"it": "Italiano"
}

module.exports = {
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
    }
}