
// Module Docs___________________________
// | Name: Fun
// | Type: MODULE
// | Function: Fun / Shitpost Commands
// |_____________________________________

try {
    const request = require("request");
    const fml = require("random_fml");
    const gif = require("giphy-api")("dc6zaTOxFJmzC"); //<= public api key
} catch (e) {
    console.error("Can't load required modules (fun.js), error: " + e.message);
}

module.exports = {
    handler: function (message, command, params, config, data) {
        try {
            if (this.handles.indexOf(command) != -1) {
                if (command == "flip" || command == "coinflip") {
                    this.flip(message);
                } else if (command == "eightball" || command == "8ball" || command == "ball") {
                    this.eightball(message, params);
                } else if (command == "lenny" || command == "lennyface") {
                    this.lenny(message);
                } else if (command == "bam") {
                    this.bam(message, params, data);
                } else if (command == "random" || command == "rand" || command == "between") {
                    this.random(message, params);
                } else if ((command == "urban" || command == "urbandict" || command == "urbandictionary") && request) {
                    this.urban(message, data, params);
                } else if ((command == "giphy" || command == "gifr" || command == "gify") && gif) {
                    this.giphy(message, data, params);
                } else if ((command == "fml" || command == "fuckmylife" || command == "fmylife") && fml) {
                    this.fml(message);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    handles: ["flip", "coinflip", "eightball", "8ball", "ball", "lenny", "lennyface", "bam", "random", "between", "urban", "giphy", "gifr", "gify", "fml", "fuckmylife", "fmylfe"],
    helpMessage: "**Fun commands**:\n `coinflip`: Flips a coin.\n `8ball` Ask the 8ball something.\n `lenny`: Gives a random lenny face.\n `bam`: Smashes an user with a hammer.\n`random`: Generates a random number (you can specify a range).\n`urban`: Defines words from the Urban Dictionary\n",
    help: function (command) {
        var helpVal = [];
        switch (command) {
            case "flip":
            case "coinflip":
                helpVal = ["Flips a coin.", ""];
                break;
            case "eightball":
            case "8ball":
            case "ball":
                helpVal = ["Ask a question to the 8ball.", "<question>"];
                break;
            case "lenny":
            case "lennyface":
                helpVal = ["Shows a random lenny face.", ""];
                break;
            case "bam":
                helpVal = ["Bams an user.", "{user}"];
                break;
            case "random":
            case "between":
                helpVal = ["Generates a random number or a number between a range.", "<value1> [value2]"];
                break;
            default:
                helpVal = null;
                break;
        }
        return helpVal;
    },
    flip: function (message) {
        var resp = ["https://i.imgur.com/wIwZGxn.png", "https://i.imgur.com/pt3XnS0.png"];
        message.channel.sendFile("" + resp[Math.floor(Math.random() * resp.length)]);
    },
    eightball: function (message, params) {
        if (params[0] && params[0] != "") {
            var resp = ["Yes!", "Yes...", "Yep!", "Definately", "Without a doubt!", "Absolutely!", "Uh...", "Well... You see...", "-silence-", "Ha.. ha.. no..", "Nope!", "Not happening!", "Well... no.", "No.", "In your dreams", "Uh.. not right now... please try again later."];
            message.channel.sendMessage(resp[Math.floor(Math.random() * resp.length)]);
        } else {
            message.reply("Please give a question for the 8ball.");
        }
    },
    lenny: function (message) {
        var responses = ["( ͡° ͜ʖ ͡°)", "¯\\\_(ツ)_/¯", "̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿", "▄︻̷̿┻̿═━一", "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)", "ʕ•ᴥ•ʔ", "(▀̿Ĺ̯▀̿ ̿)", "(ง ͠° ͟ل͜ ͡°)ง", "༼ つ ◕_◕ ༽つ", "ಠ_ಠ", "(づ｡◕‿‿◕｡)づ", "̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ✧\nﾟ･: *ヽ(◕ヮ◕ヽ)", "[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]", "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴", "( ͡°╭͜ʖ╮͡° )", "(͡ ͡° ͜ つ ͡͡°)", "(• ε •)", "(ง'̀-'́)ง", "(ಥ﹏ಥ)", "﴾͡๏̯͡๏﴿ O'RLY?", "(ノಠ益ಠ)ノ彡┻━┻", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(☞ﾟ∀ﾟ)☞", "| (• ◡•)| (❍ᴥ❍ʋ)", "(◕‿◕✿)", "(ᵔᴥᵔ)", "(╯°□°)╯︵\n ʞooqǝɔɐɟ", "(¬‿¬)", "(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)", "(づ￣ ³￣)づ", "ლ(ಠ益ಠლ)", "ಠ╭╮ಠ", "̿ ̿ ̿'̿'\̵͇̿̿\з=(•_•)=ε/̵͇̿̿/'̿'̿ ̿", "\/╲/\╭( ͡° ͡° ͜ʖ ͡° ͡°)╮/\╱\\", "(;´༎ຶД༎ຶ`)", "♪~ ᕕ(ᐛ)ᕗ", "♥‿♥", "༼ つ  ͡° ͜ʖ ͡° ༽つ", "༼ つ ಥ_ಥ ༽つ", "(╯°□°）╯︵ ┻━┻", "( ͡ᵔ ͜ʖ ͡ᵔ )", "ヾ(⌐■_■)ノ♪", "~(˘▾˘~)", "◉_◉", "\ (•◡•) /", "\ (•◡•) /", "(~˘▾˘)~", "(._.) ( l: ) ( .-. ) ( :l ) (._.)", "༼ʘ̚ل͜ʘ̚༽", "༼ ºل͟º ༼ ºل͟º ༼ ºل͟º ༽ ºل͟º ༽ ºل͟º ༽", "┬┴┬┴┤(･_├┬┴┬┴", "ᕙ(⇀‸↼‶)ᕗ", "ᕦ(ò_óˇ)ᕤ", "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻", "⚆ _ ⚆", "(•_•) ( •_•)>⌐■-■ (⌐■_■)", "(｡◕‿‿◕｡)", "ಥ_ಥ", "ヽ༼ຈل͜ຈ༽ﾉ", "⌐╦╦═─", "(☞ຈل͜ຈ)☞", "˙ ͜ʟ˙", "☜(˚▽˚)☞", "(•ω•)", "(ง°ل͜°)ง", "(｡◕‿◕｡)", "（╯°□°）╯︵( .o.)", ":')", "┬──┬ ノ( ゜-゜ノ)", "(っ˘ڡ˘ς)", "ಠ⌣ಠ", "ლ(´ڡ`ლ)", "(°ロ°)☝", "｡◕‿‿◕｡", "( ಠ ͜ʖರೃ)", "╚(ಠ_ಠ)=┐", "(─‿‿─)", "ƪ(˘⌣˘)ʃ", "(；一_一)", "(¬_¬)", "( ⚆ _ ⚆ )", "(ʘᗩʘ')", "☜(⌒▽⌒)☞", "｡◕‿◕｡", "¯\(°_o)/¯", "(ʘ‿ʘ)", "ლ,ᔑ•ﺪ͟͠•ᔐ.ლ", "(´・ω・`)", "ಠ~ಠ", "(° ͡ ͜ ͡ʖ ͡ °)", "┬─┬ノ( º _ ºノ)", "(´・ω・)っ由", "ಠ_ಥ", "Ƹ̵̡Ӝ̵̨̄Ʒ", "(>ლ)", "ಠ‿↼", "ʘ‿ʘ", "(ღ˘⌣˘ღ)", "ಠoಠ", "ರ_ರ", "(▰˘◡˘▰)", "◔̯◔", "◔ ⌣ ◔", "(✿´‿`)", "¬_¬", "ب_ب", "｡゜(｀Д´)゜｡", "°Д°", "( ﾟヮﾟ)", "┬─┬﻿ ︵ /(.□. ）", "٩◔̯◔۶", "≧☉_☉≦", "☼.☼", "^̮^", ">_>", "(/) (°,,°) (/)", "=U", "(･.◤)"];
        message.channel.sendMessage("" + responses[Math.floor(Math.random() * responses.length)]);
    },
    bam: function (message, params, data) {
        if (params[0]) {
            var user = message.mentions.users.first() || data.userFind(message.client, message.guild, params.join(" "));
            if (user) {
                if (user == message.author) {
                    message.reply("You cannot bam yourself!");
                } else {
                    message.channel.sendMessage("**BAM!** " + user + ' You were struck with a powerful hammer by **' + message.author.username + "**!");
                }
            } else {
                message.reply('Please mention someone to bam.');
            }
        } else {
            message.reply('Please select someone to bam.');
        }
    },
    random: function (message, params) {
        if (params.length == 0) {
            message.channel.sendMessage("Usage: `random <number>` - Generates a random integer from 0 to number.\n`random <number1> <number2>` - Generates a random integer between number1 and number 2");
        } else {
            var num1 = parseInt(params[0]);
            if (isNaN(num1)) {
                message.reply("Invalid value specified.");
            } else {
                if (params[1] && params[1] != "") {
                    var num2 = parseInt(params[1]);
                    if (isNaN(num2)) {
                        message.reply("Invalid value specified.");
                    } else if (num1 != num2) {
                        message.reply("Result: " + (Math.floor(Math.random() * (Math.max(num1, num2) - Math.min(num1, num2))) + Math.min(num1, num2)));
                    } else {
                        message.reply("Range is empty");
                    }
                } else {
                    if (num1 == 0) {
                        message.reply("Please specify a value different than 0");
                    } else {
                        message.reply("Result: " + Math.floor(Math.random() * num1));
                    }
                }
            }
        }
    },
    urban: function (message, data, params) {
        var search = params.join(" ");
        if (search.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "urban`: Defines words from the Urban Dictionary.\nUsage: `" + data.prefix + "urban <word to define>`");
        } else {
            var url = `http://api.urbandictionary.com/v0/define?term=${search}`
            request(url, (error, result, body) => {
                if (error) {
                    console.error(error);
                    throw new Error(error.toString);
                } else {
                    try {
                        var urban = JSON.parse(body);
                        var urbanEmbed = {
                            color: 15113758,
                            author: {
                                name: `Top definition for ${urban.list[0].word}`,
                                url: urban.list[0].permalink,
                                icon_url: "https://images.discordapp.net/.eJwFwVEOgyAMANC7cAA6YFDrbQgSNFNKaI0fy-6-977mnqdZza46ZAXYDik8NyvKM7dqG3M7ax6H2MIXZNVc9qt2FfAhBI-B8EURQ_SUwCfCRC6i80tySMsb7v7p_HQ7ejO_PwphIvs.kjWsAKclpyOeMTEoes0rz4fyFO4?width=300&height=300"
                            },
                            description: urban.list[0].definition,
                            fields: [{
                                name: "Example",
                                value: urban.list[0].example ? urban.list[0].example : "No Example",
                                inline: false
                            },
                                {
                                    name: "👍",
                                    value: urban.list[0].thumbs_up,
                                    inline: true
                                },
                                {
                                    name: "👎",
                                    value: urban.list[0].thumbs_down,
                                    inline: true
                                },
                                {
                                    name: "Defined By",
                                    value: urban.list[0].author,
                                    inline: false
                                }
                            ],
                            thumbnail: {
                                url: "https://images.discordapp.net/.eJwFwVEOgyAMANC7cAA6YFDrbQgSNFNKaI0fy-6-977mnqdZza46ZAXYDik8NyvKM7dqG3M7ax6H2MIXZNVc9qt2FfAhBI-B8EURQ_SUwCfCRC6i80tySMsb7v7p_HQ7ejO_PwphIvs.kjWsAKclpyOeMTEoes0rz4fyFO4?width=300&height=300"
                            }
                        };
                        message.channel.sendEmbed(urbanEmbed);
                    } catch (error) {
                        console.log("Error on urban\n" + error.message);
                        message.channel.sendEmbed({
                            title: "¯\\\_(ツ)_/¯",
                            description: `There isn't a definition for *${search}* yet.`,
                            color: 15113758
                        });
                    }
                }
            });
        }
    },
    giphy: function (message, data, params) {
        var search = params.join(" ");
        if (search.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "giphy`: Gets gifs from Giphy\nUsage: `" + data.prefix + "giphy <term to search>`");
        } else {
            gif.search({
                q: search,
            }, function (err, res) {
                console.log(err);
                try {
                    var result = Math.floor(Math.random() * Math.min(2, res.data.length))
                    var giphyEmbed = new data.Discord.RichEmbed()
                        .setImage(`https://media.giphy.com/media/${res.data[result].id}/giphy.gif` ? `https://media.giphy.com/media/${res.data[result].id}/giphy.gif` : `https://media.giphy.com/media/${res.data[result].id}/giphy.mp4`)
                        .addField("Source", res.data[result].source ? res.data[result].source : res.data[result].url, true)
                        .addField("Rating", res.data[result].rating.replace("r", "R  - Adult content").replace("g", "G - Safe for all").replace("pg", "PG - Parental Guidance Suggested") ? res.data[result].rating.replace("r", "R  - Adult content").replace("g", "G - Safe for all").replace("pg", "PG - Parental Guidance Suggested") : "None", false)
                        .setFooter("Powered by Giphy")
                        .setColor(15113758);
                    message.channel.sendEmbed(giphyEmbed);
                } catch (error) {
                    console.log("Error on giphy\n" + error);
                    message.channel.sendEmbed({
                        title: "¯\\\_(ツ)_/¯",
                        description: `I couldn't find any gifs matching *${search}*`,
                        color: 15113758
                    });
                }
            });
        }
    },
    fml: function (message) {
        try {
            fml().then(fml => message.channel.sendMessage(fml))
        } catch (error) {
            message.channel.sendMessage("An error happened. FML")
        }
    }
}
