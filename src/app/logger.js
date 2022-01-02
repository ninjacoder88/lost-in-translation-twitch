const fs = require("fs");

module.exports = {
    Logger: function(folderPath){
        const self = this;
        const folder = folderPath;

        function getFileName(today){
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const dayOfMonth = today.getDate();

            const yearStr = year.toString();
            const monthStr = month.toString().padStart(2, "0");
            const domStr = dayOfMonth.toString().padStart(2, "0");

            return `${folder}${yearStr}${monthStr}${domStr}.log`;
        };

        self.logInfo = function(text){
            try {
                const d = new Date();
                const fileName = getFileName(d);
                fs.appendFileSync(fileName, `${d.toISOString()} | INFO | ${text}\r\n`);
            } catch (error) {
                console.error(error);
            }
        };

        self.logError = function(text, error){
            try {
                const d = new Date();
                const fileName = getFileName(d);
                const str = `${d.toISOString()} | ERROR | ${text} ${error}\r\n`;
                //console.log(str);
                fs.appendFileSync(fileName, str);
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
                const fileName = getFileName(d);
                fs.appendFileSync(fileName, `${d.toISOString()} | DOCUMENT | ${tm} | ${r}\r\n`);
            } catch (error) {
                console.log(error);
            }

            if(reply.shouldReply === true){
                //console.log(document);
            }
        };
    }
};