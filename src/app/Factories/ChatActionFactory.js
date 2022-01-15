const {IgnoreChatAction} = require("../ChatActions/IgnoreChatAction");
const {ModerateChatAction} = require("../ChatActions/ModerateChatAction");
const {TranslateChatAction} = require("../ChatActions/TranslateChatAction");

module.exports = {
    ChatActionFactory: function(translationClientProxy){
        const self = this;
        const exclusions = ["delirya", "lul"];

        const filterArray = (arr1, arr2) => {
            const filtered = arr1.filter(el => {
               return arr2.indexOf(el) === -1;
            });
            return filtered;
         };

        function removeEmotesFromMessage(twitchMessage){
            if(!twitchMessage.emotes){
                return twitchMessage.message;
            }

            const emotePositions = [];
            for(let [id, positions] of Object.entries(twitchMessage.emotes)){
                emotePositions.push(positions);
            }

            if(emotePositions.length === 0){
                return twitchMessage.message;
            }

            const splitMessage = twitchMessage.message;

            const actualPositions = [];
            emotePositions.forEach(emotePosition => {
                const splitPosition = emotePosition.split("-");
                const startIndex = parseInt(splitPosition[0]);
                const endIndex = parseInt(splitPosition[1]);
                actualPositions.push({start: startIndex, end: endIndex});
            });

            const messageWithoutEmotes = [];
            let currentEmote = actualPositions.splice(0, 1)[0];
            for(let i = 0; i < splitMessage.length; i++){
                const letter = splitMessage[i];

                if(!currentEmote){
                    messageWithoutEmotes.push(letter);
                    continue;
                }
                
                if(i < currentEmote.start){
                    messageWithoutEmotes.push(letter);
                    continue;
                }
            
                if(i === currentEmote.start){
                    continue;
                }
            
                if(i < currentEmote.end){
                    continue;
                }
            
                if(i === currentEmote.end){
                    currentEmote = actualPositions.splice(0,1)[0];
                    continue;
                }
            }

            return messageWithoutEmotes.join("").trim().toLowerCase();
        };

        self.provideChatAction = function(twitchMessage, channelConfiguration){
            if(channelConfiguration.mode === "off"){
                return new IgnoreChatAction("mode is off");
            }

            if(twitchMessage.isMod === true){
                return new IgnoreChatAction("chat by mod");
            }

            if(twitchMessage.isBroadcaster === true){
                return new IgnoreChatAction("chat by broadcaster");
            }

            if(twitchMessage.isSubscriber === true){
                return new IgnoreChatAction("chat by subscriber");
            }

            if(twitchMessage.isVip === true){
                return new IgnoreChatAction("chat by vip");
            }

            if(twitchMessage.isFounder === true){
                return new IgnoreChatAction("chat by founder");
            }

            if(channelConfiguration.approvedUsers.indexOf(twitchMessage.username) !== -1){
                return new IgnoreChatAction("chat by approved user");
            }

            if(channelConfiguration.languages.length === 0){
                return new IgnoreChatAction("no configured languages");
            }

            if(twitchMessage.emoteOnly === true){
                return new IgnoreChatAction("emotes only");
            }

            const messageWithoutEmotes = removeEmotesFromMessage(twitchMessage);

            if(messageWithoutEmotes.length === 0){
                return new IgnoreChatAction("no message without emotes");
            }

            const words = messageWithoutEmotes.split(" ");
            
            const postFilterWords = [];
            const hardcodedWords = ["lul", "lol", "kekw"];
            words.forEach(word => {
                const wordWithoutPunc = word.replace(/,|\./gi, "");

                if(word.startsWith("http://")){
                    return;
                }

                if(word.startsWith("https://")){
                    return;
                }

                if(hardcodedWords.indexOf(wordWithoutPunc) !== -1){
                    return;
                }

                if(channelConfiguration.approvedWords.indexOf(wordWithoutPunc) !== -1){
                    return;
                }

                postFilterWords.push(word);
            });

            const filteredMessage = postFilterWords.join(" ");

            if(filteredMessage.trim().length === 0){
                return new IgnoreChatAction("empty message without exclusions");
            }

            if(channelConfiguration.mode === "translate"){
                return new TranslateChatAction(filteredMessage, twitchMessage.username, channelConfiguration, translationClientProxy);
            }

            if(channelConfiguration.mode === "moderate"){
                return new ModerateChatAction(filteredMessage, twitchMessage.messageId, channelConfiguration, translationClientProxy);
            }

            return new IgnoreChatAction("unknown mode");
        }
    }
}