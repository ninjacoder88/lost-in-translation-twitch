const { TwitchMessage } = require("./Models/TwitchMessage");

module.exports = {
    TwitchBot: function(twitchMessagingInterface, botLogger, databaseProxy, twitchApiProxy, twitchMessageHandler){
        const self = this;
        const tmi = twitchMessagingInterface;
        const logger = botLogger;
        const database = databaseProxy;
        const twitchApi = twitchApiProxy;
        const messageHandler = twitchMessageHandler;
        const joinedChannels = [];

        async function refreshChannelStatusAsync(){
            try {
                const channels = await database.getChannelsAsync();
                const channelNames = channels.map(c => c.channelName.replace("#", ""));

                const liveChannelNames = await twitchApi.getLiveStreamsAsync(channelNames);

                for(const channel of channels){
                    try {
                        if(liveChannelNames.indexOf(channel.channelName) !== -1){
                            await database.setChannelStatusAsync(channel.channelName, "live");
                            logger.logInfo(`Set ${channel.channelName} to live`);
                        } else {
                            if(channel.status !== "off air"){
                                await database.setChannelStatusAsync(channel.channelName, "off air");
                                logger.logInfo(`Set ${channel.channelName} to off air`);
                            }
                        }
                    } catch (error) {
                        logger.logError(`Failed setting channel status for ${channel.channelName}`, error);
                    }
                }
            } catch (error) {
                logger.logError(`Failed refreshing channel status`, error);
            }
        };

        async function joinChannelAsync(client, channelName, configuration){
            const index = joinedChannels.indexOf(channelName);

            if(configuration.status === "off air"){
                if(index !== -1){
                    try {
                        await client.part(channelName);
                        joinedChannels.splice(index,1);
                        logger.logInfo(`Left ${channelName}`);
                    } catch (error) {
                        logger.logError(`Failed to leave ${channelName}`, error);
                    }
                }
            }
            if(configuration.status === "live"){
                if(index === -1){
                    try {
                        await client.join(channelName);
                        joinedChannels.push(channelName);
                        logger.logInfo(`Joined ${channelName}`);
                    } catch (error) {
                        logger.logError(`Failed to join ${channelName}`, error);
                    }
                }
            }
        }

        async function joinChannelsAsync(client){
            try {
                const cache = database.getCache();

                for(let [channelName, configuration] of Object.entries(cache)){
                    await joinChannelAsync(client, channelName, configuration);
                }
            } catch (error) {
                logger.logError("", error);
            }
        };

        async function connectAsync(client){
            try {
                const server = await client.connect();
                const address = server[0];
                const port = server[1];
                logger.logInfo(`Connected to ${address}:${port}`);
            } catch (error) {
                logger.logError("Failed to connect", error);
            }
        };

        self.startAsync = async function(username, password){
            const ircClient = new tmi.client({
                identity: {
                    username: username,
                    password: password
                },
                channels: []
            });

            ircClient.on("message", (channel, messageContext, message, self) => {
                const twitchMessage = new TwitchMessage(channel, messageContext, message, self);

                messageHandler.handleMessageAsync(ircClient, twitchMessage)
                    .then(result => {
                        //logger.logInfo(result);
                    }).catch(error => {
                        logger.logError("", error);
                    });
            });

            ircClient.on("disconnected", (reason) => {
                logger.logInfo(`Disconnected - ${reason}`);
            });

            await connectAsync(ircClient);
            await refreshChannelStatusAsync();// need to run this every hour
            await joinChannelsAsync(ircClient); // need to run this every 10 minutes

            setInterval(function() {
                refreshChannelStatusAsync()
                    .catch(error => {
                        logger.logError("", error);
                    });
            }, 1000 * 60 * 30);

            setInterval(function(){
                joinChannelsAsync(ircClient)
                    .catch(error => {
                        logger.logError("", error);
                    });
            }, 1000 * 60 * 5);
        };
    }
};