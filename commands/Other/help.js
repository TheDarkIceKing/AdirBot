const Discord = require("discord.js")
const botconfig = require("../../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    if (!args[0]) {
        sendGlobalHelp(message)
    } else {
        sendSpecificHelp(message)
    }

    async function sendSpecificHelp(message) {
        let commandfile = bot.commands.get(args[0]) || bot.commands.get(bot.aliases.get(args[0]))
        if (!commandfile) {
            let notFoundEmbed = new Discord.MessageEmbed()
                .setAuthor(`Help for command "${botconfig.prefix + args[0]}"`)
                .setColor("RED")
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addFields(
                    { name: "ERROR", value: "Command not found" }
                )
            message.channel.send({ embeds: [notFoundEmbed]})
        } else {
            let commandHelpEmbed = new Discord.MessageEmbed()
                .setAuthor(`Help for command "${botconfig.prefix + args[0]}"`)
                .setColor("F4A0CC")
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL())
                .addFields(
                    { name: "Command", value: `${commandfile.config.name}` },
                    { name: `Description`, value: `${commandfile.config.description}` },
                    { name: `Usage`, value: commandfile.config.usage }
                )
            if (commandfile.config.aliases.length > 0) {
                commandHelpEmbed.addFields(
                    { name: "Aliases", value: `${commandfile.config.aliases}` },
                )
            } else {
                commandHelpEmbed.addFields(
                    { name: "Aliases", value: `*None*` },
                )
            }
            message.channel.send(await {embeds: [commandHelpEmbed]})
        }
    }


    async function sendGlobalHelp(message) {

        var globalHelpEmbed = new Discord.MessageEmbed()
            .setAuthor(`Help`)
            .setColor("F4A0CC")
            .setTimestamp()
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                { name: `Player Commands - (${await getCommandsAmount("PLAYER")})`, value: `${await loadCommands("PLAYER")}` },
                // { name: `Staff Commands - (${await getCommandsAmount("ADMINISTRATOR")})`, value: `${await loadCommands("ADMINISTRATOR")}` },
                { name: `Developer Commands - (${await getCommandsAmount("DEVELOPER")})`, value: `${await loadCommands("DEVELOPER")}` }
                // { name: `Bot Commands - (${await getCommandsAmount("BOT")})`, value: `${await loadCommands("BOT")}` }
            )

        message.channel.send({embeds: [globalHelpEmbed]})
    }

    async function loadCommands(permission) {
        var commandExplain = ""
        bot.commands.forEach(command => {
            if (command.config.permission == permission) {
                commandExplain += `***${command.config.name}*** - *${command.config.description}*\n`
            }
        })
        return commandExplain
    }
    async function getCommandsAmount(permission) {
        var commandAmount = 0
        bot.commands.forEach(command => {
            if (command.config.permission == permission) {
                commandAmount++
            }
        })
        return commandAmount
    }


}

module.exports.config = {
    name: "help",
    description: "Shows you all the commands",
    aliases: ['commands', 'command'],
    usage: "help (command)",
    permission: "PLAYER"
}