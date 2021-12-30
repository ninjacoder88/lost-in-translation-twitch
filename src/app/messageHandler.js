module.exports = {
    MessageHandler: function(databaseProxy, botCommandFactory, chatActionFactory, botLogger){
        const self = this;
        const database = databaseProxy;
        const logger = botLogger;
        const commandFactory = botCommandFactory;

        async function handleCommandAsync(ircClient, command, twitchMessage){
            if(command.isModCommand === true){
                if(twitchMessage.canRunModCommands === false){
                    logger.log(twitchMessage);
                    return;
                }
            }

            try {
                const reply = await command.executeAsync();
                logger.logMessageAndReply(twitchMessage, reply);
                //console.log(reply);
                if(reply.shouldReply === true){
                    // figure out how to whisper
                    ircClient.say(twitchMessage.channel, reply.text);
                }
            } catch (error) {
                logger.logError("", error);
            }
        }
        
        async function handleChatAsync(ircClient, twitchMessage, channelConfiguration){
            const chatAction = chatActionFactory.provideChatAction(twitchMessage, channelConfiguration);

            try {
                const reply = await chatAction.executeAsync();
                //console.log(reply);
                logger.logMessageAndReply(twitchMessage, reply);
                if(reply.shouldReply === true){
                    // figure out how to whisper
                    ircClient.say(twitchMessage.channel, reply.text);
                }
            } catch (error) {
                logger.logError("", error);
            }
        }

        self.handleMessageAsync = async function(ircClient, twitchMessage){
            if(twitchMessage.isThisBot === true){
                return false;
            }

            try {
                const channelConfiguration = await database.getChannelConfigurationAsync(twitchMessage.channel);

                if(!channelConfiguration){
                    try {
                        await ircClient.part(twitchMessage.channel);
                        logger.logInfo(`Left ${twitchMessage.channel} due to no configuration`);
                    } catch (error) {
                        logger.logError("", error);
                    }
                    return false;
                }

                const command = commandFactory.provideCommand(twitchMessage, channelConfiguration);
                if(command){
                    try {
                        await handleCommandAsync(ircClient, command, twitchMessage);
                    } catch (error){
                        logger.logError("", error);
                    }
                } else {
                    try {
                        await handleChatAsync(ircClient, twitchMessage, channelConfiguration);
                    } catch (error) {
                        logger.logError("", error);
                    }
                }
            } catch (error) {
                logger.logError("", error);
                return false;
            }
        };
    }
};