const { ChatReply } = require("../Models/ChatReply");

module.exports = {
    ModerateChatAction: function(message, messageId, channelConfiguration, translationClientProxy){
        const self = this;

        self.executeAsync = async function(){
            const sample = message.toLowerCase().trim().split(" ").splice(0, 5).join(" ");

            const detectionResult = await translationClientProxy.detectLanguageAsync(sample);

            if(channelConfiguration.languages.indexOf(detectionResult.detectedLanguage) !== -1){
                return new ChatReply(false, undefined, sample, detectionResult.detectedLanguage, undefined, "detection of approved language");
            }

            return ChatReply(true, `/delete ${messageId}`, sample, detectionResult.detectedLanguage);
        }
    }
}