const { CommandReply } = require("../Models/CommandReply");

module.exports = {
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