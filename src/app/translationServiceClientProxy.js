const { TranslationServiceClient } = require("@google-cloud/translate");
const { TranslationResult, DetectionResult } = require("./models");

module.exports = {
    TranslationServiceClientProxy: function(projectId, logger){
        const self = this;
        const translationClient = new TranslationServiceClient();

        self.translateAsync = async function(message, targetLanguageCode){
            try {
                const request = {
                    parent: `projects/${projectId}/locations/global`,
                    contents: [message],
                    mimeType: "text/plain",
                    //sourceLanguageCode: "ru",
                    targetLanguageCode: targetLanguageCode,
                };
        
                const [response] = await translationClient.translateText(request);
    
                return new TranslationResult(true, response.translations);
            } catch (error) {
                logger.logError("", error);
                return new TranslationResult(false);
            }
        },
        self.detectLanguageAsync = async function(message){
            try {
                const request = {
                    parent: `projects/${projectId}/locations/global`,
                    content: message,
                };
        
                const [response] = await translationClient.detectLanguage(request);
    
                return new DetectionResult(true, response.languages);
            } catch (error) {
                logger.logError("", error);
                return new DetectionResult(false);
            }
        }
    }
};