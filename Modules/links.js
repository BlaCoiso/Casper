
// Module Docs___________________________
// | Name: Info
// | Type: MODULE
// | Function: Bot Information Module
// |_____________________________________

module.exports = {
    handler: function (message, command, params, config, data) {
        if (this.handles.indexOf(command) != -1) {
            if (command == "github" || command == "botcode" || command == "git") {
                this.github(message);
            } else if (command == "invite" || command == "invites") {
                this.invite(message);
            }
        }
    },
    handles: ["github", "botcode", "invite", "invites"],
    helpMessage: "**Bot links**:\n `github`: Gives the link for the GitHub\n `invite`: Gives the bot invite link.\n",
    github: function (message) {
        message.reply("**Source Code**\n  - https://github.com/sammyvsparks/CasperProject/ ");
    },
    invite: function (message) {
        message.reply("** My Invites**\n  - Server: https://discord.gg/ARUgyRP\n - Test Server: https://discord.gg/88YfYME\n  - OAuth2: https://discordapp.com/oauth2/authorize?client_id=240498925189070848&scope=bot&permissions=268823574");
    }
}
