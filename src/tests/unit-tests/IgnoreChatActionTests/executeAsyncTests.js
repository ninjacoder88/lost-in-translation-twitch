const { IgnoreChatAction } = require("../../../app/ChatActions/IgnoreChatAction");

function Test(){
    function ReturnsChatReply(){
        const SUT = new IgnoreChatAction("testing");

        SUT.executeAsync()
            .then(result => {
                if(result.shouldReply === false){
                    console.log()
                } else {
                    throw "IgnoreChatAction should set shouldReply to false";
                }
            }).catch(error => {
                throw `executeAsync returned an error ${error}`;
            });
    }

    ReturnsChatReply();
}

Test();