const { CommandReply } = require("../Models/CommandReply");

module.exports = {
    HelloCommand: function(){
        const self = this;
        self.isModCommand = false;

        self.executeAsync = async function(){
            return new CommandReply(true, "Hello, I am lost in translation bot a.k.a LITBOT. I am a bot that can help moderate and help chat be more inclusive by automatically translating chat that is in a language not used by the streamer.");
        };
    }
}