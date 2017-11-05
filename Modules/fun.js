// Module Docs___________________________
// | Name: Fun
// | Type: CASPER_MODULE
// | Function: Fun commands for Casper
// |_____________________________________

module.exports = {
    handles(event) { return event == "message" },
    commands: [
        {
            name: "coin",
            description: "Flip a coin",
            allowDM: true,
            aliases: ["flip", "coinflip"],
            run(msg, args) {
                return { text: `The coin landed on **${Math.round(Math.random()) ? "Heads" : "Tails"}**.`, reply: true };
            }
        },
        {
            name: "8ball",
            description: "The 8ball says...",
            allowDM: true,
            aliases: ["8", "ball", "eightball"],
            run(msg, args) {
                let replyMsgs = ["Yes!", "Yes...", "Yep!", "Definitely", "Without a doubt!", "Absolutely!", "Obviously!", //7
                    "Uh...", "Well... You see...", "-silence-", "Uh.. not right now... please try again later.", //4
                    "Ha.. ha.. no..", "Nope!", "Not happening!", "Well... no.", "No.", "In your dreams", "Nah..."]; //7
                var randReplyMsg = replyMsgs[Math.floor(Math.random() * replyMsgs.length)];
                return { text: 'The 8ball says: `' + randReplyMsg + '`.', reply: true, embed: new args.embed().setTitle('The 8ball says:').setDescription(randReplyMsg).setColor(15113758) };
            }
        }
    ]
}