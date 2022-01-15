module.exports = {
    TranslationResult: function(success, translations){
        const self = this;
        self.success = success;
        self.translations = translations;
        self.translation = self.translations[0].translatedText;
        self.detectedLanguage = self.translations[0].detectedLanguageCode;
    }
}