module.exports = {
    ChannelConfiguration: function(document){
        const self = this;
        self.channelName = document.channelName;
        self.mode = document.mode;
        self.languages = document.languages;
        self.approvedUsers = document.approvedUsers;
        self.replyAs = document.replyAs;
        self.enabled = document.enabled;
        self.status = document.status;
        self.approvedWords = document.approvedWords;
        self.cacheDate = new Date();
        self.translateUsers = document.translateUsers;
    }
}