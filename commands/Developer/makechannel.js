const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    try {
        const channelName= args.toString();
         await message.guild.channels.create(channelName, {
            type: 'GUILD_TEXT' //This create a text channel, you can make a voice one too, by changing "text" to "voice"
          })
    }
    catch (err) {
        console.log(err)
    }
}

module.exports.config = {
    name: "makechannel",
    description: "makes a channel",
    aliases: [],
    usage: "makechannel (name)",
    permission: "DEVELOPER"
}