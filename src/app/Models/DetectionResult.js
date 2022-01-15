module.exports = {
    DetectionResult: function(success, languages){
        const self = this;
        self.success = success;
        self.languages = languages;
        self.detectedLanguage = self.languageCodes[0].languageCode;
    }
}