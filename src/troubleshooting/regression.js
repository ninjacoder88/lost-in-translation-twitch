const tmi = require("tmi.js");
const { DatabaseProxy } = require("../app/databaseProxy");
const { TwitchApiProxy } = require("../app/twitchApiProxy");
const { MongoClientProxy } = require("../app/mongoClientProxy");
const { Logger } = require("../app/logger");
const { CredentialLoader } = require("../app/Utilities/CredentialLoader");
const { TwitchBot } = require("../app/twitchBot");
const { MessageHandler } = require("../app/messageHandler");
const { BotCommandFactory } = require("../app/Factories/BotCommandFactory");
const { ChatActionFactory } = require("../app/Factories/ChatActionFactory");
const { TranslationServiceClientProxy } = require("../app/translationServiceClientProxy");
const { MessageSanitizer } = require("../app/Utilities/MessageSanitizer");

const logger = new Logger("../app/logs/");
const credentialLoader = new CredentialLoader("../app/secrets/litbot-credentials.json", logger);

const credentials = credentialLoader.loadCredentials();

const messageSanitizer = new MessageSanitizer();
const twitchApiProxy = new TwitchApiProxy(credentials.twitchApiToken, credentials.twitchClientId, logger);
const mongoClientProxy = new MongoClientProxy(credentials.mongoConnectionString, logger);
const databaseProxy = new DatabaseProxy(mongoClientProxy);
const botCommandFactory = new BotCommandFactory(databaseProxy);
const translationClientProxy = new TranslationServiceClientProxy(credentials.googleProjectId, logger);
const chatActionFactory = new ChatActionFactory(translationClientProxy, messageSanitizer);
const messageHandler = new MessageHandler(databaseProxy, botCommandFactory, chatActionFactory, logger);
const twitchBot = new TwitchBot(tmi, logger, databaseProxy, twitchApiProxy, messageHandler);



translationClientProxy.translateAsync("privet", "ru")
    .then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });

    /*
const { TwitchMessage } = require("../app/Models/TwitchMessage");


const ircClient = new tmi.client({
    identity: {
        username: credentials.twitchUsername,
        password: credentials.twitchIrcToken
    },
    channels: ["ninjacoder88"]
});

ircClient.on("message", (channel, messageContext, message, self) => {
    const twitchMessage = new TwitchMessage(channel, messageContext, message, self);

    messageHandler.handleMessageAsync(ircClient, twitchMessage)
        .then(result => {

        }).catch(error => {
            console.log(error);
        });
});

ircClient.connect()
    .then(server => {

    }).catch(error => {
        console.log(error);
    });
    */