
// Module Docs___________________________
// | Name: Fun
// | Type: MODULE
// | Function: Fun / Shitpost Commands
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "flip" || command == "coinflip") {
                this.flip(message);
            } else if (command == "eightball" || command == "8ball" || command == "ball") {
                this.eightball(message);
            } else if (command == "lenny" || command == "lennyface") {
                this.lenny(message);
            } else if (command == "bam") {
              this.bam(message);
            }
        }
    },
    handles: ["flip", "coinflip", "eightball", "8ball", "ball", "lenny", "lennyface", "bam"],
    helpMessage: "**Fun commands**:\n `coinflip`: Flips a coin.\n `8ball` Ask the 8ball something.\n `lenny`: Gives a random lenny face.\n `bam`: Smashes the mentioned person with a hammer.\n",
    flip: function (message) {
        var resp = ["https://i.imgur.com/wIwZGxn.png", "https://i.imgur.com/pt3XnS0.png"];
        message.channel.sendFile("" + resp[Math.floor(Math.random() * resp.length)]);
    },
    eightball: function (message) {
        var resp = ["Yes!", "Yes...", "Yep!", "Definately", "Without a doubt!", "Absolutely!", "Uh...", "Well... You see...", "-silence-", "Ha.. ha.. no..", "Nope!", "Not happening!", "Well... no.", "No.", "In your dreams", "Uh.. not right now... please try again later."];
        message.channel.sendMessage("" + resp[Math.floor(Math.random() * resp.length)]);
    },
    lenny: function (message) {
        var responses = ["( ͡° ͜ʖ ͡°)", "¯\\\_(ツ)_/¯", "̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿", "▄︻̷̿┻̿═━一", "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)", "ʕ•ᴥ•ʔ", "(▀̿Ĺ̯▀̿ ̿)", "(ง ͠° ͟ل͜ ͡°)ง", "༼ つ ◕_◕ ༽つ", "ಠ_ಠ", "(づ｡◕‿‿◕｡)づ", "̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ✧\nﾟ･: *ヽ(◕ヮ◕ヽ)", "[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]", "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴", "( ͡°╭͜ʖ╮͡° )", "(͡ ͡° ͜ つ ͡͡°)", "(• ε •)", "(ง'̀-'́)ง", "(ಥ﹏ಥ)", "﴾͡๏̯͡๏﴿ O'RLY?", "(ノಠ益ಠ)ノ彡┻━┻", "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(☞ﾟ∀ﾟ)☞", "| (• ◡•)| (❍ᴥ❍ʋ)", "(◕‿◕✿)", "(ᵔᴥᵔ)", "(╯°□°)╯︵\n ʞooqǝɔɐɟ", "(¬‿¬)", "(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)", "(づ￣ ³￣)づ", "ლ(ಠ益ಠლ)", "ಠ╭╮ಠ", "̿ ̿ ̿'̿'\̵͇̿̿\з=(•_•)=ε/̵͇̿̿/'̿'̿ ̿", "\/╲/\╭( ͡° ͡° ͜ʖ ͡° ͡°)╮/\╱\\", "(;´༎ຶД༎ຶ`)", "♪~ ᕕ(ᐛ)ᕗ", "♥‿♥", "༼ つ  ͡° ͜ʖ ͡° ༽つ", "༼ つ ಥ_ಥ ༽つ", "(╯°□°）╯︵ ┻━┻", "( ͡ᵔ ͜ʖ ͡ᵔ )", "ヾ(⌐■_■)ノ♪", "~(˘▾˘~)", "◉_◉", "\ (•◡•) /", "\ (•◡•) /", "(~˘▾˘)~", "(._.) ( l: ) ( .-. ) ( :l ) (._.)", "༼ʘ̚ل͜ʘ̚༽", "༼ ºل͟º ༼ ºل͟º ༼ ºل͟º ༽ ºل͟º ༽ ºل͟º ༽", "┬┴┬┴┤(･_├┬┴┬┴", "ᕙ(⇀‸↼‶)ᕗ", "ᕦ(ò_óˇ)ᕤ", "┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻", "⚆ _ ⚆", "(•_•) ( •_•)>⌐■-■ (⌐■_■)", "(｡◕‿‿◕｡)", "ಥ_ಥ", "ヽ༼ຈل͜ຈ༽ﾉ", "⌐╦╦═─", "(☞ຈل͜ຈ)☞", "˙ ͜ʟ˙", "☜(˚▽˚)☞", "(•ω•)", "(ง°ل͜°)ง", "(｡◕‿◕｡)", "（╯°□°）╯︵( .o.)", ":')", "┬──┬ ノ( ゜-゜ノ)", "(っ˘ڡ˘ς)", "ಠ⌣ಠ", "ლ(´ڡ`ლ)", "(°ロ°)☝", "｡◕‿‿◕｡", "( ಠ ͜ʖರೃ)", "╚(ಠ_ಠ)=┐", "(─‿‿─)", "ƪ(˘⌣˘)ʃ", "(；一_一)", "(¬_¬)", "( ⚆ _ ⚆ )", "(ʘᗩʘ')", "☜(⌒▽⌒)☞", "｡◕‿◕｡", "¯\(°_o)/¯", "(ʘ‿ʘ)", "ლ,ᔑ•ﺪ͟͠•ᔐ.ლ", "(´・ω・`)", "ಠ~ಠ", "(° ͡ ͜ ͡ʖ ͡ °)", "┬─┬ノ( º _ ºノ)", "(´・ω・)っ由", "ಠ_ಥ", "Ƹ̵̡Ӝ̵̨̄Ʒ", "(>ლ)", "ಠ‿↼", "ʘ‿ʘ", "(ღ˘⌣˘ღ)", "ಠoಠ", "ರ_ರ", "(▰˘◡˘▰)", "◔̯◔", "◔ ⌣ ◔", "(✿´‿`)", "¬_¬", "ب_ب", "｡゜(｀Д´)゜｡", "°Д°", "( ﾟヮﾟ)", "┬─┬﻿ ︵ /(.□. ）", "٩◔̯◔۶", "≧☉_☉≦", "☼.☼", "^̮^", ">_>", "(/) (°,,°) (/)", "=U", "(･.◤)"];
        message.channel.sendMessage("" + responses[Math.floor(Math.random() * responses.length)]);
    },
    bam: function (message) {
	  if(message.mentions.users.first()) {
			if(message.mentions.users.first() == message.author) {
				message.reply("You cannot bam yourself!");
			} else {
			  message.channel.sendMessage("**BAM!** " + message.mentions.users.first() + ' You were struck with a powerful hammer by **' + message.author.username + "**!");
		  }
		} else {
			message.reply('Please mention someone to bam.');
		}
	}
}
