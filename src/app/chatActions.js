// TODO: refactor?
const { ChatReply } = require("./models");

module.exports = {
    IgnoreChatAction: function(reason){
        const self = this;

        self.executeAsync = async function(){
            return new ChatReply(false, undefined, undefined, undefined, undefined, reason);
        }
    },
    TranslateChatAction: function(message, username, channelConfiguration, translationClientProxy){
        const self = this;

        self.executeAsync = async function(){
            const sample = message.toLowerCase().trim().split(" ").splice(0, 5).join(" ");

            const initialTranslationResult = await translationClientProxy.translateAsync(sample, "en");

            if(channelConfiguration.languages.indexOf(initialTranslationResult.detectedLanguage) !== -1){
                return new ChatReply(false, undefined, sample, initialTranslationResult.detectedLanguage, undefined, "translation to approved language");
            }

            const translationResult = await translationClientProxy.translateAsync(message, "en");

            return new ChatReply(true, `@${username} said (${translationResult.detectedLanguage}): ${translationResult.translation}`, message, translationResult.detectedLanguage, translationResult.translation);
        }
    },
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