const tmi = require("tmi.js");
const { DatabaseProxy } = require("./databaseProxy");
const { TwitchApiProxy } = require("./twitchApiProxy");
const { MongoClientProxy } = require("./mongoClientProxy");
const { Logger } = require("./logger");
const { CredentialLoader } = require("./Utilities/CredentialLoader");
const { TwitchBot } = require("./twitchBot");
const { MessageHandler } = require("./messageHandler");
const { BotCommandFactory } = require("./Factories/BotCommandFactory");
const { ChatActionFactory } = require("./Factories/ChatActionFactory");
const { TranslationServiceClientProxy } = require("./translationServiceClientProxy");
const { MesssageSanitizer } = require("./Utilities/MessageSanitizer");

const logger = new Logger("./logs/");
const credentialLoader = new CredentialLoader("./secrets/litbot-credentials.json", logger);

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

twitchBot.startAsync(credentials.twitchUsername, credentials.twitchIrcToken)
    .catch(error => {
        logger.logError("", error);
    });