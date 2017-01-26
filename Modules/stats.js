
// Module Docs___________________________
// | Name: Stats
// | Type: MODULE
// | Function: Statistics
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "stats" || command == "botinfo" || command == "botstats" || command == "info") {
                this.bot(message, data.client, data.Discord, data.prefix, data.isTest);
            }
        }
    },
    handles: ["stats", "botinfo", "botstats", "info"],
    helpMessage: "**Statistics for bot**: `stats`\n",
    help: function (command) {
        if (command == "stats" || command == "botinfo" || command == "botstats" || command == "info") {
            return ["Gives the bot's stats.", ""];
        } else {
            return null;
        }
    },
    bot: function (message, Client, Discord, prefix, test) {
        try {
            var stats = {
                color: 15113758,
                url: "https://discordapp.com/oauth2/authorize?client_id=240498925189070848&scope=bot&permissions=268823574",
                author: {
                    name: Client.user.username + " Stats and Info",
                    icon_url: Client.user.displayAvatarURL,
                    url: "https://discordapp.com/oauth2/authorize?client_id=240498925189070848&scope=bot&permissions=268823574"
                },
                fields: [
                  {
                      name: 'Prefix',
                      value: prefix,
                      inline: true
                  },
                  {
                      name: 'Library Version',
                      value: Discord.version,
                      inline: true
                  },
                  {
                      name: 'Servers',
                      value: Client.guilds.size,
                      inline: true
                  },
                  {
                      name: 'Users',
                      value: Client.users.size,
                      inline: true
                  },
                  {
                      name: 'Created by',
                      value: "BlaCoiso#2018, Greg#5821, gotkeyzjr#6283, Lego#5763, Samuel#1101",
                      inline: false
                  }, {
                      name: "Test Version",
                      value: test ? "Yes" : "No",
                      inline: true
                  }
                ],
                thumbnail: {
                    url: Client.user.avatarURL
                }
            };
            message.channel.sendEmbed(stats);
        } catch (e) {
            throw e;
        }
    }
}
