const fs = require("fs");

module.exports = {
    Logger: function(filePath){
        const self = this;

        self.logInfo = function(text){
            try {
                const d = new Date();
                fs.appendFileSync(filePath, `${d.toISOString()} | INFO | ${text}\r\n`);
            } catch (error) {
                console.error(error);
            }
        };

        self.logError = function(text, error){
            try {
                const d = new Date();
                const str = `${d.toISOString()} | ERROR | ${text} ${error}\r\n`;
                console.error(str);
                fs.appendFileSync(filePath, start);
            } catch (error) {
                console.error(error);
            }
        };

        self.logMessageAndReply = function(twitchMessage, reply){
            if(reply === undefined){
                reply = {};
            }
        
            var document = {
                channel: twitchMessage.channel,
                username: twitchMessage.username,
                message: twitchMessage.message,
                isMod: twitchMessage.isMod,
                isSubscriber: twitchMessage.isSubscriber,
                isVip: twitchMessage.isVip,
                isFounder: twitchMessage.isFounder,
                isModCommand: reply.isModCommand,
                shouldReply: reply.shouldReply,
                replyText: reply.text,
                language: reply.language,
                translation: reply.translation,
                sample: reply.sampledMessage,
                debug: reply.debug,
                date: new Date()
            };

            try {
                const tm = `${twitchMessage.channel} | ${twitchMessage.username} | ${twitchMessage.message} |  ${twitchMessage.isMod} | ${twitchMessage.isSubscriber} | ${twitchMessage.isVip} | ${twitchMessage.isFounder}`;
                const r = `${reply.isModCommand} | ${reply.shouldReply} | ${reply.text} | ${reply.language} | ${reply.translation} | ${reply.sampledMessage} | ${reply.debug}`;
                const d = new Date();
                fs.appendFileSync(filePath, `${d.toISOString()} | DOCUMENT | ${tm} | ${r}\r\n`);
            } catch (error) {
                console.error(error);
            }

            if(reply.shouldReply === true){
                console.log(document);
            }
        };
    }
};