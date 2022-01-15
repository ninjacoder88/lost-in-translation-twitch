const fs = require("fs");
const { Credentials } = require("../Models/Credentials");

module.exports = {
    CredentialLoader: function(filePath, logger){
        const self = this;

        self.loadCredentials = function(){
            try {
                const data = fs.readFileSync(filePath, "utf-8");
                const jsonObject = JSON.parse(data);
                return new Credentials(jsonObject);
            } catch (error) {
                logger.logError("", error);
            }
        }
    }
}