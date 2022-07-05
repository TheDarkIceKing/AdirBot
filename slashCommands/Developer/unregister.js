const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(process.env.token);

module.exports = {

    data: new SlashCommandBuilder()
        .setName("deletecommands")
        .setDescription("Delete guild commands"),
    async execute(bot, interaction) {
        interaction.reply({
            content: `Deleting commands`,
            ephemeral: true
        });
        bot.slashCommands = new Discord.Collection();
        const slashCommands = [];
        const clientId = '862190339141533707';
        await rest.put(
            Routes.applicationGuildCommands(clientId, masterGuildId),
            { body: slashCommands },
        );

    }
}


module.exports.config = {
    name: "unregister",
    description: "shuts down the bot",
    aliases: ["kill"],
    permission: "DEVELOPER"
}