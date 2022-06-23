const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('randomplayer')
        .setDescription('Picks a random player')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The mode you are selecting a player with')
                .setRequired(true)
                .addChoices(
                    { name: 'Voice', value: 'Voice' }
                )),
    async execute(bot, interaction) {
        if (interaction.options.getString("mode") == "Voice") {
            if (interaction.guild.members.cache.get(interaction.member.id).voice.channelId) {
                voicePicker(interaction, interaction.guild.members.cache.get(interaction.member.id).voice.channelId)
            } else {
                interaction.reply({ content: "You are not in vc", ephemeral: true })
            }

        }

        async function voicePicker(interaction, id) {
            incallPlayers = [];
            interaction.guild.channels.cache.get(id).members.forEach((member) => {
                playername = member.nickname || member.user.username
                incallPlayers.push(playername)
            })
            const random = Math.floor(Math.random() * incallPlayers.length);
            let getTheFuckOut = incallPlayers[random];
            var rolembed = new Discord.MessageEmbed()
                .setTitle("Random voice picker")
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setTimestamp()
                .addFields({ name: "Winner", value: "Spinning..." })
                .setThumbnail("https://dashboard.snapcraft.io/site_media/appmedia/2017/10/tali.png")
            players = ""
            var arrayLength = incallPlayers.length;
            for (var i = 0; i < arrayLength; i++) {
                if (i == 0) {
                    players += `${transformletter(incallPlayers[i])} \n`
                } else {
                    players += `${incallPlayers[i]} \n`
                }

            }
            spincount = 1

            rolembed.addFields({ name: "Players", value: players })

            interaction.deferReply({ embeds: [rolembed] }).then((sentArray) => {

                roller = setInterval(function () {
                    players = ""
                    let firstitem = incallPlayers.pop()
                    incallPlayers.unshift(firstitem);
                    rolembed.fields = []
                    rolembed.addFields({ name: "Winner", value: "Spinning..." })
                    for (var i = 0; i < arrayLength; i++) {
                        if (i == 0) {
                            players += `${transformletter(incallPlayers[i])} \n`
                        } else {
                            players += `${incallPlayers[i]} \n`
                        }

                    }
                    if (getTheFuckOut == incallPlayers[0]) {
                        if (spincount == 0) {
                            clearInterval(roller)
                            rolembed.fields = []
                            rolembed.fields.unshift({ name: "Winner", value: transformletter(incallPlayers[0]) })
                            rolembed.color = "#ff0000"
                            rolembed.setThumbnail("https://is4-ssl.mzstatic.com/image/thumb/Purple118/v4/35/a4/2f/35a42fa8-9452-c06d-9ee9-0dd4c1b4cbf2/source/256x256bb.jpg")
                        } else {
                            spincount = 0
                        }
                    } else {

                    }

                    rolembed.addFields({ name: "Players", value: players })
                    rolembed.color = Math.floor(Math.random() * 16777215).toString(16);
                    interaction.editReply({ embeds: [rolembed] })
                }, 1200);

            })



        }
        function isLetter(str) {
            return str.length === 1 && str.match(/[a-z]/i);
        }
        function isNumber(str) {
            return str.length === 1 && str.match(/[0-9]/i);
        }
        function transformletter(playername) {
            newname = ""
            numberToLetter = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"]
            playername.split("").forEach((letter) => {
                if (isLetter(letter)) {
                    characteremoji = ":regional_indicator_" + letter.toLowerCase() + ":"
                } else if (isNumber(letter)) {
                    emojislot = parseInt(letter)
                    characteremoji = numberToLetter[emojislot]
                } else if (letter == " ") {
                    characteremoji = "      "
                } else {
                    characteremoji = `${letter}`
                }
                newname += characteremoji;
            })
            return newname
        }


    }

}


module.exports.config = {
    permission: "PLAYER"
}