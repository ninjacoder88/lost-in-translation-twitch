const { CommandReply } = require("../Models/CommandReply");

module.exports = {
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
    }
}