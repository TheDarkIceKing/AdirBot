const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    message.channel.send({content: "restarting bot"})
    setTimeout(function () {
        process.exit();
    }, 5000);
}

module.exports.config = {
    name: "restart",
    description: "restarts the bot",
    aliases: ["kill"],
    usage: "restar",
    permission: "DEVELOPER"
}