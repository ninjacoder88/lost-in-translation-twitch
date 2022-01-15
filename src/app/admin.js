const { MongoClientProxy } = require("./mongoClientProxy");
const { CredentialLoader } = require("./credentialLoader");
const { Logger } = require("./logger");

const logger = new Logger("./logs/");
const credentialLoader = new CredentialLoader("./secrets/litbot-credentials.json", logger);

const credentials = credentialLoader.loadCredentials();
const mongoClientProxy = new MongoClientProxy(credentials.mongoConnectionString, logger);

//mongoClientProxy.addChannelConfigurationAsync("#delirya");
mongoClientProxy.updateChannelModeAsync("#delirya", "translate")
    .then(() => {
        return mongoClientProxy.addLanguageAsync("#delirya", "en");
    }).then(() => {
        return mongoClientProxy.addApprovedUserAsync("#delirya", "jackiepal");
    }).then(() => {
        return mongoClientProxy.addApprovedUserAsync("#delirya", "louis_xix");
    }).then(() => {
        return mongoClientProxy.addApprovedUserAsync("#delirya", "igiyuki");
    }).catch(error =>{
        console.log(error);
    });




