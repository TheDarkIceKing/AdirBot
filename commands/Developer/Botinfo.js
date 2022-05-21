const Discord = require("discord.js")
var os = require('os');


module.exports.run = async (bot, message, args) => {
    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} dagen, ${hours} uur, ${minutes} minuten en ${seconds} seconds`;

    message.channel.send("Pinging...").then(m => {
        var ping = m.createdTimestamp - message.createdTimestamp;


        var usedMemory = os.totalmem() - os.freemem(), totalMemory = os.totalmem();

        var getpercentage =
            ((usedMemory / totalMemory) * 100).toFixed(2) + '%'

        console.log("Memory used in GB", (usedMemory / Math.pow(1024, 3)).toFixed(2))
        console.log("Used memory", getpercentage);

        var pingembed = new Discord.MessageEmbed()
            .setTitle(bot.user.username)
            .setColor("F4A0CC")
            .setThumbnail(bot.user.displayAvatarURL())
            .addFields(
                { name: 'Latency', value: `${ping}ms` },
                { name: 'API Latency', value: `${Math.round(bot.ws.ping)}ms` },
                { name: 'Uptime', value: `${uptime}` },
                { name: "Memory", value: (usedMemory / Math.pow(1024, 3)).toFixed(2) + ", (" + getpercentage + ")" }
            )
            .setTimestamp()
        m.delete()
        m.channel.send({embeds: [pingembed]})
    })
}

module.exports.config = {
    name: "botinfo",
    description: "Get technical details about the bot",
    aliases: ['ping', 'uptime', 'online', 'latency'],
    usage: "botinfo",
    permission: "DEVELOPER"
}