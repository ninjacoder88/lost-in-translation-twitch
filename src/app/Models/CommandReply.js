module.exports = {
    CommandReply: function(shouldReply, text){
        const self = this;
        self.shouldReply = shouldReply;
        self.text = text;
    }
}