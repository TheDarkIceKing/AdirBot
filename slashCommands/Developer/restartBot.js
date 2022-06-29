const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
 
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("restart the bot"),
    async execute(bot, interaction) {
        interaction.reply({
            content: `Restarting bot`,
            ephemeral: true
        });
        setTimeout(function () {
            process.exit();
        }, 5000);
    }
}


module.exports.config = {
    name: "restart",
    description: "restarts the bot",
    aliases: [],
    usage: "restart",
    permission: "DEVELOPER"
}