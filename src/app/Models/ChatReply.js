module.exports = {
    ChatReply: function(shouldReply, text, sampledMessage, language, translation, debugText){
        const self = this;
        self.shouldReply = shouldReply;
        self.text = text;
        self.language = language;
        self.translation = translation;
        self.debugText = debugText;
        self.sampledMessage = sampledMessage;
    }
}