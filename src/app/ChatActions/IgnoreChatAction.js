const { ChatReply } = require("../Models/ChatReply");

module.exports = {
    IgnoreChatAction: function(reason){
        const self = this;

        self.executeAsync = async function(){
            return new ChatReply(false, undefined, undefined, undefined, undefined, reason);
        }
    }
}