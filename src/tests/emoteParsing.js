const message = "hola, twitchHola how are you twitchWave today";
const emotePositions = ["6-16", "29-39"];

if(!emotePositions){
    return message;
}

if(emotePositions.length === 0){
    return message;
}

const splitMessage = message.split("");

const actualPositions = [];
emotePositions.forEach(emotePosition => {
    const splitPosition = emotePosition.split("-");
    const startIndex = parseInt(splitPosition[0]);
    const endIndex = parseInt(splitPosition[1]);
    actualPositions.push({start: startIndex, end: endIndex});
});

console.log(splitMessage);
console.log(actualPositions);

const messageWithoutEmotes = [];
let currentEmote = actualPositions.splice(0, 1)[0];
let filtering = false;
for(let i = 0; i < splitMessage.length; i++){
    const letter = splitMessage[i];
    console.log({letter, letter, emote: currentEmote, position: i});

    if(!currentEmote){
        console.log("no emote");
        messageWithoutEmotes.push(letter);
        continue;
    }
    
    if(i < currentEmote.start){
        console.log("less than start");
        messageWithoutEmotes.push(letter);
        continue;
    }

    if(i === currentEmote.start){
        console.log("equal to start");
        continue;
    }

    if(i < currentEmote.end){
        console.log("less than end");
        continue;
    }

    if(i === currentEmote.end){
        console.log("equal to end");
        currentEmote = actualPositions.splice(0,1)[0];
        continue;
    }

    console.log("default");
}

console.log(messageWithoutEmotes.join(""));