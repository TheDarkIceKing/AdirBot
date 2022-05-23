const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    process.exit();
}

module.exports.config = {
    name: "restart",
    description: "restarts the bot",
    aliases: [],
    usage: "restart",
    permission: "DEVELOPER"
}