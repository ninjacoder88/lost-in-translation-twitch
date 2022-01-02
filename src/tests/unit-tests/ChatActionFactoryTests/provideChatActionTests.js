const { ChatActionFactory } = require("../../../app/factories");
const { ChannelConfiguration } = require("../../../app/models");

function Test(){
    const translationClientProxy = {};
    
    function ChannelConfigurationModeIsOff_ReturnsIgnoreChatAction(){
        const twitchMessage = {};
        const channelConfiguration = new ChannelConfiguration({mode: "off"});

        const SUT = new ChatActionFactory(translationClientProxy);

        const result = SUT.provideChatAction(twitchMessage, channelConfiguration);

        if(result.constructor.name !== "IgnoreChatAction"){
            throw "Action was not of type IgnoreChatAction";
        }
    }

    function MessageShouldBeTranslated(){
        const document = {
            mode: "translate",
            languages: "test",
            approvedUsers: [],
            approvedWords: ["hola", "delirya"]
        };
        const twitchMessage = {
            message: "hola, twitchHola how are you delirya twitchWave today. http://website.com look at this",
            emotes: {1: "6-16", 2: "37-47"}
        };
        const channelConfiguration = new ChannelConfiguration(document);

        const SUT = new ChatActionFactory(translationClientProxy);

        const result = SUT.provideChatAction(twitchMessage, channelConfiguration);

        if(result.constructor.name !== "TranslateChatAction"){
            throw "Action was not of type TranslateChatAction";
        }
    }

    ChannelConfigurationModeIsOff_ReturnsIgnoreChatAction();
    MessageShouldBeTranslated();
};

Test();