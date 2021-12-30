const https = require("https");

module.exports = {
    TwitchApiProxy: function(oauthToken, clientId, logger){
        const self = this;

        function getAsync(path){
            const options = {
                hostname: "api.twitch.tv",
                port: 443,
                path: path,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oauthToken}`,
                    "Client-Id": `${clientId}`
                }
            }

            return new Promise((resolve, reject) => {
                const request = https.request(options, response => {
                    response.on("data", d => {
                        resolve(JSON.parse(d));
                    });
    
                    response.on("error", error => {
                        reject(error);
                    });
                });
    
                request.end();
            });
        };

        self.getLiveStreamsAsync = async function(channels){
            try {
                const channelNames = channels.join("&user_login=");

                const response = await getAsync(`helix/streams?user_login=${channelNames}`);

                if(!response){
                    return [];
                }
    
                return response.data.map(d => `#${d.user_login}`);
            } catch (error) {
                logger.logError("", error);
            }
        };
    }
};