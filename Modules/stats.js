
// Module Docs___________________________
// | Name: Stats
// | Type: MODULE
// | Function: Statistics
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "stats" || command == "botinfo" || command == "botstats" || command == "info") {
                this.bot(message, data.client, data.Discord, data.prefix);
            }
        }
    },
    handles: ["stats", "botinfo", "botstats", "info"],
    helpMessage: "**Statistics for bot**: `stats`\n",
    bot: function (message, Client, Discord, prefix) {
        message.channel.sendMessage(
			"Casper Bot stats and info (beta version)\n" +
			" - Name: " + Client.user.username + "#" + Client.user.discriminator + " | " + Client.user.id + "\n" +
			" - Prefix: " + prefix + "\n" +
			" - Library Version: " + Discord.version + "\n" +
			"Other Stats\n" +
			" - Users: " + Client.users.size + "\n" +
			" - Guilds: " + Client.guilds.size + "\n" +
            " - Created by: BlaCoiso#2018, Greg#5821, Samuel#1101, gotkeyzjr#6283"
		);
    }
}
