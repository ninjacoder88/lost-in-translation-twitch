const { CommandReply } = require("../Models/CommandReply");

module.exports = {
    TranslateCommand: function(){
        const self = this;
        self.isModCommand = true;

        self.executeAsync = async function(){
            return new CommandReply(false);
        }
    }
}