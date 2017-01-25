// Module Docs___________________________
// | Name: Fun
// | Type: MODULE
// | Function: Fun / Shitpost Commands
// |_____________________________________

const request = require('request');
const gif = require('giphy-api')('dc6zaTOxFJmzC'); //<= public api key

module.exports = {
    handler: function(message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "flip" || command == "coinflip") {
                this.flip(message);
            } else if (command == "eightball" || command == "8ball" || command == "ball") {
                this.eightball(message);
            } else if (command == "lenny" || command == "lennyface") {
                this.lenny(message);
            } else if (command == "urban" || command == "urbandict" || command == "urbandictionary") {
                this.urban(message, data, params);
            } else if (command == "giphy" || command == "gifr" || command == "gify") {
                this.giphy(message, data, params);
            }
        }
    },
    handles: ["flip", "coinflip", "eightball", "8ball", "ball", "lenny", "lennyface", "urban", "giphy", "gifr", "gify"],
    helpMessage: "**Fun commands**:\n `coinflip`: Flips a coin.\n `8ball` Ask the 8ball something.\n `lenny`: Gives a random lenny face.\n`urban`: Defines words from the Urban Dictionary\n",
    flip: function(message) {
        var resp = ["https://i.imgur.com/wIwZGxn.png", "https://i.imgur.com/pt3XnS0.png"];
        message.channel.sendFile("" + resp[Math.floor(Math.random() * resp.length)]);
    },
    eightball: function(message) {
        var resp = ["Yes!", "Yes...", "Yep!", "Definately", "Without a doubt!", "Absolutely!", "Uh...", "Well... You see...", "-silence-", "Ha.. ha.. no..", "Nope!", "Not happening!", "Well... no.", "No.", "In your dreams", "Uh.. not right now... please try again later."];
        message.channel.sendMessage("" + resp[Math.floor(Math.random() * resp.length)]);
    },
    lenny: function(message) {
        var responses = ["( ͡° ͜ʖ ͡°)", "¯\\\_(ツ)_/¯", "̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿", "▄︻̷̿┻̿═━一", "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)", "ʕ•ᴥ•ʔ", "(▀̿Ĺ̯▀̿ ̿)", "(ง ͠° ͟ل͜ ͡°)ง", "༼ つ ◕_◕ ༽つ", "ಠ_ಠ", "(づ｡◕‿‿◕｡)づ", "̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ✧\nﾟ･: *ヽ(◕ヮ◕ヽ)", "[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]", "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴", "( ͡°╭͜ʖ╮͡° )", "(͡ ͡° ͜ つ ͡͡°)", "(• ε •)", "(ง'̀-'́)ง", "(ಥ﹏ಥ)", "﴾͡๏̯͡๏﴿ O'RLY?", "(ノಠ益ಠ)ノ彡┻━┻", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(☞ﾟ∀ﾟ)☞", "| (• ◡•)| (❍ᴥ❍ʋ)", "(◕‿◕✿)", "(ᵔᴥᵔ)", "(╯°□°)╯︵\n ʞooqǝɔɐɟ", "(¬‿¬)", "(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)", "(づ￣ ³￣)づ", "ლ(ಠ益ಠლ)", "ಠ╭╮ಠ", "̿ ̿ ̿'̿'\̵͇̿̿\з=(•_•)=ε/̵͇̿̿/'̿'̿ ̿", "\/╲/\╭( ͡° ͡° ͜ʖ ͡° ͡°)╮/\╱\\", "(;´༎ຶД༎ຶ`)", "♪~ ᕕ(ᐛ)ᕗ", "♥‿♥", "༼ つ  ͡° ͜ʖ ͡° ༽つ", "༼ つ ಥ_ಥ ༽つ", "(╯°□°）╯︵ ┻━┻", "( ͡ᵔ ͜ʖ ͡ᵔ )", "ヾ(⌐■_■)ノ♪", "~(˘▾˘~)", "◉_◉", "\ (•◡•) /", "\ (•◡•) /", "(~˘▾˘)~", "(._.) ( l: ) ( .-. ) ( :l ) (._.)", "༼ʘ̚ل͜ʘ̚༽", "༼ ºل͟º ༼ ºل͟º ༼ ºل͟º ༽ ºل͟º ༽ ºل͟º ༽", "┬┴┬┴┤(･_├┬┴┬┴", "ᕙ(⇀‸↼‶)ᕗ", "ᕦ(ò_óˇ)ᕤ", "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻", "⚆ _ ⚆", "(•_•) ( •_•)>⌐■-■ (⌐■_■)", "(｡◕‿‿◕｡)", "ಥ_ಥ", "ヽ༼ຈل͜ຈ༽ﾉ", "⌐╦╦═─", "(☞ຈل͜ຈ)☞", "˙ ͜ʟ˙", "☜(˚▽˚)☞", "(•ω•)", "(ง°ل͜°)ง", "(｡◕‿◕｡)", "（╯°□°）╯︵( .o.)", ":')", "┬──┬ ノ( ゜-゜ノ)", "(っ˘ڡ˘ς)", "ಠ⌣ಠ", "ლ(´ڡ`ლ)", "(°ロ°)☝", "｡◕‿‿◕｡", "( ಠ ͜ʖರೃ)", "╚(ಠ_ಠ)=┐", "(─‿‿─)", "ƪ(˘⌣˘)ʃ", "(；一_一)", "(¬_¬)", "( ⚆ _ ⚆ )", "(ʘᗩʘ')", "☜(⌒▽⌒)☞", "｡◕‿◕｡", "¯\(°_o)/¯", "(ʘ‿ʘ)", "ლ,ᔑ•ﺪ͟͠•ᔐ.ლ", "(´・ω・`)", "ಠ~ಠ", "(° ͡ ͜ ͡ʖ ͡ °)", "┬─┬ノ( º _ ºノ)", "(´・ω・)っ由", "ಠ_ಥ", "Ƹ̵̡Ӝ̵̨̄Ʒ", "(>ლ)", "ಠ‿↼", "ʘ‿ʘ", "(ღ˘⌣˘ღ)", "ಠoಠ", "ರ_ರ", "(▰˘◡˘▰)", "◔̯◔", "◔ ⌣ ◔", "(✿´‿`)", "¬_¬", "ب_ب", "｡゜(｀Д´)゜｡", "°Д°", "( ﾟヮﾟ)", "┬─┬﻿ ︵ /(.□. ）", "٩◔̯◔۶", "≧☉_☉≦", "☼.☼", "^̮^", ">_>", "(/) (°,,°) (/)", "=U", "(･.◤)"];
        message.channel.sendMessage("" + responses[Math.floor(Math.random() * responses.length)]);
    },
    urban: function(message, data, params) {
        var search = params.join(" ");
        if (search.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "urban`: Defines words from the Urban Dictionary.\nUsage: `" + data.prefix + "urban <word to define>`");
        } else {
            var url = `http://api.urbandictionary.com/v0/define?term=${search}`
            request(url, (error, result, body) => {
                if (error) {
                    console.error(error);
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
                        console.log("ERROR ON URBAN GIT FUCKING GUD\n" + error.message);
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
    giphy: function(message, data, params) {
        var search = params.join(" ");
        if (search.length == 0) {
            message.channel.sendMessage("`" + data.prefix + "giphy`: Gets gifs from Giphy\nUsage: `" + data.prefix + "giphy <term to search>`");
        } else {
            gif.search({
                q: search,
                limit: 1
            }, function(err, res) {
                try {
                    var giphyEmbed = new data.Discord.RichEmbed()
                        .setImage(`https://media.giphy.com/media/${res.data[0].id}/giphy.gif` ? `https://media.giphy.com/media/${res.data[0].id}/giphy.gif` : `https://media.giphy.com/media/${res.data[0].id}/giphy.mp4`)
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
    }
}
