const { CommandReply } = require("../Models/CommandReply");

module.exports = {
    GetModeCommand: function(channelConfiguration){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            return new CommandReply(true, `litbot mode is ${channelConfiguration.mode}`);
        }
    }
}