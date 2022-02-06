const { CommandReply } = require("../Models/CommandReply");

module.exports = {
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

            if(action === "translate-on"){
                await database.addTranslateUserAsync(channelName, username);
                return new CommandReply(true, `${username} will be translated`);
            }

            if(action === "translate-off"){
                await database.removeTranslateUserAsync(channelName, username);
                return new CommandReply(true, `${username} will no longer be translated`);
            }

            return new CommandReply(false);
        };
    }
}