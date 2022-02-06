const { ChannelConfiguration } = require("./Models/ChannelConfiguration");

module.exports = {
    DatabaseProxy: function(mongoClientProxy){
        const self = this;
        const cache = {};

        async function loadChannelConfigurationAsync(channelName){
            const document = await mongoClientProxy.getChannelConfigurationAsync(channelName);
    
            if(document){
                cache[channelName] = new ChannelConfiguration(document);
            }

            return cache[channelName];
        };

        async function getCacheAsync(channelName){
            const configuration = cache[channelName];
            if(!configuration){
                return await loadChannelConfigurationAsync(channelName);
            }

            const now = new Date();
            const before = configuration.cacheDate;

            const cacheTime = (now - before) / 1000 / 60 / 60;

            if(cacheTime > 1){
                return await loadChannelConfigurationAsync(channelName);
            }

            return configuration;
        };

        self.addApprovedUserAsync = async function(channelName, username){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.approvedUsers.indexOf(username) === -1){
                await mongoClientProxy.addApprovedUserAsync(channelName, username);
                cache[channelName].approvedUsers.push(username);
            }
        };

        self.addApprovedWordAsync = async function(channelName, word){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.approvedWords.indexOf(word) === -1){
                await mongoClientProxy.addApprovedWordAsync(channelName, word);
                cache[channelName].approvedWords.push(word);
            }
        };

        self.addChannelLanguageAsync = async function(channelName, languageCode){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.languages.indexOf(languageCode) === -1){
                await mongoClientProxy.addLanguageAsync(channelName, languageCode);
                cache[channelName].languages.push(languageCode);
            }
        };

        self.addTranslateUserAsync = async function(channelName, username){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.translateUsers.indexOf(username) === -1){
                await mongoClientProxy.addTranslateUserAsync(channelName, username);
                cache[channelName].translateUsers.push(username);
            }
        };

        self.getCache = function(){
            return cache;
        };

        self.getChannelConfigurationAsync = async function(channelName){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;
            }

            return configuration;
        };

        self.getChannelsAsync = async function(){
            const documents = await mongoClientProxy.getChannelsAsync();

            const configs = [];
            documents.forEach(document => {
                const config = new ChannelConfiguration(document);
                cache[document.channelName] = config;
                configs.push(config);
            });

            return configs;
        };

        self.removeApprovedUserAsync = async function(channelName, username){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            const index = configuration.approvedUsers.indexOf(username);
            if(index !== -1){
                await mongoClientProxy.removeApprovedUserAsync(channelName, username);
                cache[channelName].approvedUsers.splice(index, 1);
            }
        };

        self.removeTranslateUserAsync = async function(channelName, username){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            const index = configuration.translateUsers.indexOf(username);
            if(index !== -1){
                await mongoClientProxy.removeTranslateUserAsync(channelName, username);
                cache[channelName].translateUsers.splice(index, 1);
            }
        };

        self.removeApprovedWordAsync = async function(channelName, word){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            const index = configuration.approvedWords.indexOf(word);
            if(index !== -1){
                await mongoClientProxy.removeApprovedWordAsync(channelName, word);
                cache[channelName].approvedWords.splice(index, 1);
            }
        };

        self.removeChannelLanguageAsync = async function(channelName, langageCode){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            const index = configuration.languages.indexOf(langageCode);
            if(index !== -1){
                await mongoClientProxy.removeLanguageAsync(channelName, langageCode);
                cache[channelName].languages.splice(index, 1);
            }
        };

        self.setChannelStatusAsync = async function(channelName, status){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.status !== status){
                await mongoClientProxy.updateChannelStatusAsync(channelName, status);
                cache[channelName].status = status;
            }
        };

        self.setChannelModeAsync = async function(channelName, mode){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.mode !== mode){
                await mongoClientProxy.updateChannelModeAsync(channelName, mode);
                cache[channelName].mode = mode;
            }
        };

        self.setReplyAsAsync = async function(channelName, replyAs){
            const configuration = await getCacheAsync(channelName);

            if(!configuration){
                return false;// not sure what to return;
            }

            if(configuration.replyAs !== replyAs){
                await mongoClientProxy.updateChannelReplyAsync(channelName, replyAs);
                cache[channelName].replyAs = replyAs;
            }
        };
    }
};