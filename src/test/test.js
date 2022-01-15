const assert = require("assert");
const {IgnoreChatAction} = require("../app/ChatActions/IgnoreChatAction");
const {MessageSanitizer} = require("../app/Utilities/MessageSanitizer");

describe("IgnoreChatAction", function(){
    describe("#executeAsync", function(){
        it("should return a ChatReply object with shouldReply set to false", async function(){
            const SUT = new IgnoreChatAction("testing");
            const result = await SUT.executeAsync();
            assert.equal(result.shouldReply, false, "some message");
        });
    });
});

describe("MessageSanitizer", function(){
    const SUT = new MessageSanitizer();

    describe("#removeEmotes", function(){
        it("should return same string is message has no emotes", function(){
            const message = "hello this is only a test";

            const result = SUT.removeEmotes({message: message});

            assert.equal(result, message);
        });

        it("should remove emotes at beginning of message returning remaining text", function(){
            const message = "twitchHello hello this is only a test";
            const result = SUT.removeEmotes({message: message, emotes: {1: ["0-11"]}});
            assert.equal(result, "hello this is only a test");
        });

        it("should remove emotes at end of message returning remaining text", function(){
            const message = "hello this is only a test twitchHello";
            const result = SUT.removeEmotes({message: message, emotes: {1: ["26-37"]}});
            assert.equal(result, "hello this is only a test");
        });

        it("should remove emotes in the middle of message returning remaining text", function(){
            const message = "hello twitchHello this is only a test";
            const result = SUT.removeEmotes({message: message, emotes: {1: ["6-17"]}});
            assert.equal(result, "hello this is only a test");
        });

        it("should remove all emotes from message leaving only text", function(){
            const message = "twitchHello hello twitchHello this is only a test twitchHello";
            const result = SUT.removeEmotes({message: message, emotes: {1: ["0-11", "18-29"], 2: ["50-61"]}});
            assert.equal(result, "hello this is only a test");
        });
    });

    describe("#removeApprovedWords", function(){
        it("should remove http links from the beginning", function(){
            const message = "http://clickthislink.com check this out";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out");
        });

        it("should remove http links from the end", function(){
            const message = "check this out http://clickthislink.com ";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out");
        });

        it("should remove http links from the middle", function(){
            const message = "check this out http://clickthislink.com its awesome";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out its awesome");
        });

        it("should remove https links from the beginning", function(){
            const message = "https://clickthislink.com check this out";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out");
        });

        it("should remove https links from the end", function(){
            const message = "check this out https://clickthislink.com ";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out");
        });

        it("should remove https links from the middle", function(){
            const message = "check this out https://clickthislink.com its awesome";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "check this out its awesome");
        });

        it("should remove hardcoded words from the beginning", function(){
            const message = "lul hello";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "hello");
        });

        it("should remove hardcoded words from the middle", function(){
            const message = "hello lul hello";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "hello hello");
        });

        it("should remove hardcoded words from the end", function(){
            const message = "hello lul";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "hello");
        });

        it("should remove hardcoded words from the message despite capitalization", function(){
            const message = "LUL hello lUl hello LuL";
            const result = SUT.removeApprovedWords(message, []);
            assert.equal(result, "hello hello");
        });

        it("should remove approved words from the beginning", function(){
            const message = "del hello";
            const result = SUT.removeApprovedWords(message, ["del"]);
            assert.equal(result, "hello");
        });

        it("should remove approved words from the middle", function(){
            const message = "hello del hello";
            const result = SUT.removeApprovedWords(message, ["del"]);
            assert.equal(result, "hello hello");
        });

        it("should remove approved words from the end", function(){
            const message = "hello del";
            const result = SUT.removeApprovedWords(message, ["del"]);
            assert.equal(result, "hello");
        });

        it("should remove approved words from the message despite capitalization", function(){
            const message = "DEL hello dEl hello DeL";
            const result = SUT.removeApprovedWords(message, ["del"]);
            assert.equal(result, "hello hello");
        });

        it("should remove all approved words from the message despite capitalization", function(){
            const message = "DEL hello dEl hello DeL bonjour to all";
            const result = SUT.removeApprovedWords(message, ["del", "bonjour"]);
            assert.equal(result, "hello hello to all");
        });
    });
});