const { CommandReply } = require("../Models/CommandReply");

module.exports = {
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
    }
}