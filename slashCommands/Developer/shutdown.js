const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(process.env.token);

module.exports = {
 
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("shutdown the bot"),
    async execute(bot, interaction) {
        interaction.reply({
            content: `Shutting down`,
            ephemeral: true
        });
        setTimeout(async function () {
            bot.slashCommands = new Discord.Collection();
            const slashCommands = [];
            const clientId = '862190339141533707';
            masterGuildId = process.env.enviroment == "DEVELOPMENT" ?  '889940595638960178' : null
            if(masterGuildId){
                await rest.put(
                    Routes.applicationGuildCommands(clientId, masterGuildId),
                    { body: slashCommands },
                ); 
            } else {
                await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: slashCommands },
                ); 
            }

            process.exit();
        }, 1000);
    }
}


module.exports.config = {
    name: "shutdown",
    description: "shuts down the bot",
    aliases: ["kill"],
    permission: "DEVELOPER"
}