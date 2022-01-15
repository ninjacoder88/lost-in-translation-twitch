const { CommandReply } = require("../Models/CommandReply");

module.exports = {
    NullCommand: function(){
        const self = this;
        self.isModCommand = false;
        
        self.executeAsync = async function(){
            return new CommandReply(false);
        }
    }
}