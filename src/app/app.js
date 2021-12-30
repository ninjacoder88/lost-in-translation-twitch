const tmi = require("tmi.js");
const { DatabaseProxy } = require("./databaseProxy");
const { TwitchApiProxy } = require("./twitchApiProxy");
const { MongoClientProxy } = require("./mongoClientProxy");
const { Logger } = require("./logger");
const { CredentialLoader } = require("./credentialLoader");
const { TwitchBot } = require("./twitchBot");
const { MessageHandler } = require("./messageHandler");
const { BotCommandFactory, ChatActionFactory } = require("./factories");
const { TranslationServiceClientProxy } = require("./translationServiceClientProxy");

const logger = new Logger("./logs/log.log");
const credentialLoader = new CredentialLoader("./secrets/litbot-credentials.json", logger);

const credentials = credentialLoader.loadCredentials();

const twitchApiProxy = new TwitchApiProxy(credentials.twitchApiToken, credentials.twitchClientId, logger);
const mongoClientProxy = new MongoClientProxy(credentials.mongoConnectionString, logger);
const databaseProxy = new DatabaseProxy(mongoClientProxy);
const botCommandFactory = new BotCommandFactory(databaseProxy);
const translationClientProxy = new TranslationServiceClientProxy(credentials.googleProjectId, logger);
const chatActionFactory = new ChatActionFactory(translationClientProxy);
const messageHandler = new MessageHandler(databaseProxy, botCommandFactory, chatActionFactory, logger);
const twitchBot = new TwitchBot(tmi, logger, databaseProxy, twitchApiProxy, messageHandler);

twitchBot.startAsync(credentials.twitchUsername, credentials.twitchIrcToken)
    .catch(error => {
        logger.logError("", error);
    });