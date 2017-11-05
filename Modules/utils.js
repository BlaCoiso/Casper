// Module Docs___________________________
// | Name: Moderator
// | Type: CASPER_MODULE 
// | Function: Moderation commands/features
// |_____________________________________

module.exports = {
    handles(event) {
        return ["message"].includes(event);
    },
    fullName: "Utility",
    commands: [
        {
            name: "userinfo",
            description: "Gives information about a user, this command accepts IDs, names, or mentions.",
            allowDM: true,
            aliases: ["user", "uinfo", "whois"],
            usage: "[user]",
            run(msg, args) {
                let user = args.utils.userFind(msg.client, msg.guild, args.paramsJoined) || msg.mentions.users.first();
                let notFound = false;
                if (!user) {
                    user = msg.author;
                    if (args.params.length != 0) notFound = true;
                }
                let userGuild = !args.isDM ? msg.guild.member(user) : null;
                let roles = userGuild ? userGuild.roles.filter(r=>r.name != "@everyone").array() : null;
                let status = {
                    dnd: "Do Not Disturb",
                    offline: "Offline/Invisible",
                    online: "Online",
                    idle: "Idle"
                };
                let userAvatar = user.displayAvatarURL.replace("jpg", "png");
                let userStreamStatus = user.presence.game ? user.presence.game.streaming ? `Streaming **[${args.Discord.escapeMarkdown(user.presence.game.name)}](${user.presence.game.url})**` : `Playing **${args.Discord.escapeMarkdown(user.presence.game.name)}**` : null;
                let userTag = `${user.username}#${user.discriminator}${user.bot ? " [BOT]" : ""}`;
                let userNickname = userGuild ? userGuild.nickname : null;
                let userCreated = `${args.utils.translateDate(user.createdAt)}, **${args.utils.checkDays(user.createdAt)}**`;
                let userJoined = userGuild ? `${args.utils.translateDate(userGuild.joinedAt)}, **${args.utils.checkDays(userGuild.joinedAt)}**` : null;
                let userRoles = roles ? args.Discord.escapeMarkdown(
                    roles.sort((b, c) => c.position - b.position).map(e => e.name).join(", ")) : null;
                let userID = "";
                if (notFound) userID = `User wasn't found. | ID: ${user.id}`;
                else if (userGuild || args.isDM) userID = `ID: ${user.id}`;
                else userID = `User is not in server | ID: ${user.id}`;
                let uEmbed = new args.embed().setColor(args.color).setThumbnail(userAvatar).setFooter(userID);
                userStreamStatus ? uEmbed.setDescription(userStreamStatus) : null;
                uEmbed.setAuthor(userTag, userAvatar)
                    .addField("Created", userCreated);
                userJoined ? uEmbed.addField("Joined", userJoined) : null;
                uEmbed.addField("Status", status[user.presence.status], true)
                    .addField("Avatar URL", `[Click Here!](${userAvatar})`, true);
                userRoles ? uEmbed.addField("Roles", userRoles, true) : null;
                userNickname ? uEmbed.addField("Nickname", userNickname, true) : null;
                let uText = `**User**: ${user.tag}\n${userNickname ? "**Nickname**: " + userNickname + "\n" : ""}**Created at**: ${userCreated}\n${userJoined ? "**Joined at:**: " + userJoined + "\n" : ""}**Status**: ${status[user.presence.status]}\n**Avatar URL**: ${userAvatar}\n${userRoles ? "**Roles**: " + userRoles + "\n" : ""}`;
                return { text: uText, embed: uEmbed };
            }
        },
        {
            name: "serverinfo",
            description: "Gives information about the server or any other server Casper is in, to get info on another server, provide the ID.",
            aliases: ["server", "sinfo", "guild"],
            run(msg, args) {
                let guild = msg.client.guilds.get(args.paramsJoined) || msg.guild;
                let region = {
                    "brazil": "Brazil",
                    "eu-central": "Central Europe",
                    "singapore": "Singapore",
                    "us-central": "U.S. Central",
                    "sydney": "Sydney",
                    "us-east": "U.S. East",
                    "us-south": "U.S. South",
                    "us-west": "U.S. West",
                    "eu-west": "Western Europe",
                    "vip-us-east": "VIP U.S. East",
                    "london": "London",
                    "amsterdam": "Amsterdam",
                    "hongkong": "Hong Kong",
                    "vip-amsterdam": "VIP Amsterdam"
                }; //There might be some missing regions
                const verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵ ┻━┻"];
                let serverFooter = `ID: ${guild.id} | This server has ${guild.memberCount.toLocaleString()} members in total (including bots).`;
                let serverIcon = guild.iconURL ? guild.iconURL.replace("jpg", "png") : msg.client.user.displayAvatarURL.replace("jpg", "png");
                let serverCreated = `${args.utils.translateDate(guild.createdAt)}, **${args.utils.checkDays(guild.createdAt)}**`;
                let serverOwner = `${args.Discord.escapeMarkdown(guild.owner.user.username)}#${guild.owner.user.discriminator}`;
                let serverRegion = region[guild.region] || guild.region;
                let serverMembers = guild.members.filter(m => !m.user.bot)
                let serverMembersCount = serverMembers.filter(m=>m.presence.status != "offline").size.toLocaleString() + " / " + serverMembers.size.toLocaleString();
                let serverBots = guild.members.filter(m => m.user.bot);
                let serverBotsCount = serverBots.filter(m=>m.presence.status != "offline").size.toLocaleString() + " / " + serverBots.size.toLocaleString();
                let serverTextChannels = guild.channels.filter(c => c.type === "text").size.toLocaleString();
                let serverVoiceChannels = guild.channels.filter(c => c.type === "voice").size.toLocaleString();
                let serverChannels = `${serverTextChannels} Text and ${serverVoiceChannels} Voice`;
                let serverVerificationLevel = verifLevels[guild.verificationLevel];
                let serverRoles = (guild.roles.size - 1).toLocaleString();
                let sEmbed = new args.embed().setColor(args.color).setFooter(serverFooter)
                    .setAuthor(guild.name, serverIcon)
                    .setThumbnail(serverIcon)
                    .addField("Created", serverCreated)
                    .addField("Owner", serverOwner, true)
                    .addField("Region", serverRegion, true)
                    .addField("Members", serverMembersCount, true)
                    .addField("Bots", serverBotsCount, true)
                    .addField("Channels", serverChannels, true)
                    .addField("Roles", serverRoles, true)
                    .addField("Verification Level", serverVerificationLevel, true);
                let sText = `*Server**: ${guild.name}\n**Created at**: ${serverCreated}\n**Owner**: ${serverOwner}\n*Region**: ${serverRegion}\n` +
                    `**Members**: ${serverMembersCount}\n**Bots**: ${serverBotsCount}\n**Channels**: ${serverChannels}\n**Roles**: ${serverRoles}` +
                    `\n**Verification Level**: ${serverVerificationLevel}`;
                return { text: sText, embed: sEmbed };
            }
        },
        {
            name: "avatar",
            description: "Gives a user's avatar, this command accepts IDs, names, or mentions.",
            allowDM: true,
            usage: "[user]",
            run(msg, args) {
                let user = args.utils.userFind(msg.client, msg.guild, args.paramsJoined) || msg.mentions.users.first() || msg.author;
                let avatar = user.displayAvatarURL.replace("jpg", "png");
                return { embed: new args.embed().setAuthor(user.username, avatar).setImage(avatar).setFooter(`ID: ${user.id}`).setColor(args.color) };
            }
        },
        {
            name: "roleinfo",
            description: "Gives info about a role, this command accepts IDs, names, or mentions.",
            aliases: "role",
            usage: "<role>",
            run(msg, args) {
                if (args.params.length == 0) {
                    return { text: `\`${args.prefix + args.command}\`: ${this.description}` };
                } else {
                    let role = args.utils.roleFind(msg.guild, args.paramsJoined);
                    if (role) {
                        let colorImg = `http://www.beautycolorcode.com/${role.color === 0 ? "8B99A4" : role.hexColor.split("#").join("")}-80x80.png`
                        let footer = `ID: ${role.id} | This role is ${role.hoist ? "" : "not "}displayed in the member bar.`;
                        let members = role.members.size == 0 ? "None" : role.members.map(m => m.user.toString()).join(" ");
                        let created = `${args.utils.translateDate(role.createdAt)}, **${args.utils.checkDays(role.createdAt)}**`;
                        let rEmbed = new args.embed().setColor(role.color === 0 ? 9148836 : role.color).setFooter(footer)
                            .setAuthor(args.Discord.escapeMarkdown(role.name), colorImg).setThumbnail(colorImg)
                            .addField("Created", created)
                            .addField("Hex Code", role.hexColor, true).addField("Mentionable", role.mentionable ? "Yes" : "No", true);
                        members ? rEmbed.addField(`${role.members.size.toLocaleString()} Members`, role.members.size > 35 ? "Too many members to display." : members) : null
                        return { embed: rEmbed };
                    } else return { text: "Role wasn't found." };
                }
            }
        },
        {
            name: "roles",
            description: "Lists roles in the server",
            aliases: ["rolelist", "listroles"],
            run(msg, args) {
                let guild = msg.guild;
                let roles = args.Discord.escapeMarkdown(guild.roles.filter(r=>r.name != "@everyone").array().sort((b, c) => c.position - b.position).map(r=>r.name).join(", "));
                let embed = { title: `${(guild.roles.size - 1).toLocaleString()} Roles`, description: roles, color: args.color };
                let text = `This guild has ${(guild.roles.size - 1).toLocaleString()} roles:\n ${roles}`;
                return { embed: embed, text: text };
            }
        }
    ]
};