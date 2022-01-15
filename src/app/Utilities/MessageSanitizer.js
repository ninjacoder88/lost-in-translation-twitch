module.exports = {
    MessageSanitizer: function(){
        const self = this;

        self.removeEmotes = function(twitchMessage){
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

            return messageWithoutEmotes.join("").trim();
        };

        self.removeApprovedWords = function(messageWithoutEmotes, approvedWords){
            const words = messageWithoutEmotes.toLowerCase().split(" ");
            
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

                if(approvedWords.indexOf(wordWithoutPunc) !== -1){
                    return;
                }

                postFilterWords.push(word);
            });

            return postFilterWords.join(" ").trim();
        };
    }
}