const { MongoClientProxy } = require("./app/mongoClientProxy");
const { Logger } = require("./app/logger");
const { CredentialLoader } = require("./app/credentialLoader");
const { DatabaseProxy } = require("./app/databaseProxy");
const { TwitchApiProxy } = require("./app/twitchApiProxy");
const databaseProxy = require("./app/databaseProxy");

const l = new Logger("log.log");
const cl = new CredentialLoader("./app/secrets/litbot-credentials.json", l);

var c = cl.loadCredentials();

const mcp = new MongoClientProxy(c.mongoConnectionString, l);
const dp = new DatabaseProxy(mcp);
const tap = new TwitchApiProxy(c.twitchApiToken, c.twitchClientId, l);


let allChannels = undefined;
dp.getChannelsAsync()
    .then(channels => {
        console.log(channels);
        allChannels = channels;
        const channelArray = channels.map(c => c.channelName.replace("#",""));

        return tap.getLiveStreamsAsync(channelArray);
        
    }).then(liveChannels => {
        console.log(liveChannels);

        allChannels.forEach(c => {
            console.log(c);
            if(liveChannels.indexOf(c.channelName) !== -1){
                dp.updateChannelStatusAsync(c.channelName, "live");
            } else {
                dp.updateChannelStatusAsync(c.channelName, "off air");
            }
        });

        
    }).catch(error => {
        console.log(error);
    });
