const { MongoClient } = require("mongodb");

module.exports = {
    MongoClientProxy: function(connectionString, logger){
        const self = this;
        const client = new MongoClient(connectionString);

        async function updateChannelAsync(channelName, updateDocument){
            try {
                await client.connect();
    
                const database = client.db("LostInTranslation");
                const collection = database.collection("ChannelConfigurations");
    
                const query = {
                    channelName: channelName
                }
    
                await collection.updateOne(query, updateDocument);
            } catch (error) {
                logger.logError("", error);
            } finally {
                await client.close();
            }
        };

        self.addApprovedUserAsync = async function(channelName, username){
            await updateChannelAsync(channelName, {
                $push: {
                    "approvedUsers": username
                }
            });
        };

        self.addApprovedWordAsync = async function(channelName, word){
            await updateChannelAsync(channelName, {
                $push: {
                    "approvedWords": word
                }
            });
        };

        self.addTranslateUserAsync = async function(channelName, username){
            await updateChannelAsync(channelName, {
                $push: {
                    "translateUsers": username
                }
            });
        };

        self.addChannelConfigurationAsync = async function(channelName){
            try {
                await client.connect();
    
                const database = client.db("LostInTranslation");
                const collection = database.collection("ChannelConfigurations");
    
                const document = {
                    channelName: channelName,
                    mode: "off",
                    replyAs: "chat",
                    status: "off air",
                    languages: [],
                    approvedUsers: [],
                    approvedWords: [],
                    enabled: true
                }
        
                await collection.insertOne(document);
            } catch (error) {
                logger.logError("", error);
            } finally {
                await client.close();
            }
        };

        self.addLanguageAsync = async function(channelName, languageCode){
            await updateChannelAsync(channelName, {
                $push: {
                    "languages": languageCode
                }
            });
        };

        self.getChannelConfigurationAsync = async function(channelName){
            try {
                await client.connect();
    
                const database = client.db("LostInTranslation");
                const collection = database.collection("ChannelConfigurations");
    
                const query = {
                    channelName: channelName
                }
        
                return await collection.findOne(query);
            } catch (error) {
                logger.logError("", error);
            } finally {
                await client.close();
            }
        };

        self.getChannelsAsync = async function(){
            try {
                await client.connect();
    
                const database = client.db("LostInTranslation");
                const collection = database.collection("ChannelConfigurations");
    
                const query = {}
    
                const cursor = collection.find(query);
    
                return await cursor.toArray();
            } catch(error){
                logger.logError("", error);
            } finally {
                await client.close();
            }
        };

        self.removeApprovedUserAsync = async function(channelName, username){
            await updateChannelAsync(channelName, {
                $pull: {
                    "approvedUsers": username
                }
            });
        };

        self.removeTranslateUserAsync = async function(channelName, username){
            await updateChannelAsync(channelName, {
                $pull: {
                    "translateUsers": username
                }
            });
        };

        self.removeApprovedWordAsync = async function(channelName, word){
            await updateChannelAsync(channelName, {
                $pull: {
                    "approvedWords": word
                }
            });
        };

        self.removeLanguageAsync = async function(channelName, languageCode){
            await updateChannelAsync(channelName, {
                $pull: {
                    "languages": languageCode
                }
            });
        };

        self.updateChannelModeAsync = async function(channelName, mode){
            await updateChannelAsync(channelName, {
                $set: {
                    "mode": mode
                }
            });
        };

        self.updateChannelReplyAsync = async function(channelName, replyAs){
            await updateChannelAsync(channelName, {
                $set: {
                    "replyAs": replyAs
                }
            });
        };

        self.updateChannelStatusAsync = async function(channelName, status){
            await updateChannelAsync(channelName, {
                $set: {
                    "status": status
                }
            });
        };

        self.logTranslationAsync = async function(channelName, username, message, sample, language, translation, time){
            try {
                await client.connect();
    
                const database = client.db("LostInTranslation");
                const collection = database.collection("TranslationLog");
    
                const document = {
                    channelName: channelName,
                    username: username, 
                    message: message, 
                    sample: sample,
                    language: language,
                    translation: translation,
                    time: time
                };
        
                await collection.insertOne(document);
            } catch (error) {
                logger.logError("", error);
            } finally {
                await client.close();
            }
        };
    }
};