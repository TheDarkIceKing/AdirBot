const Discord = require("discord.js")
const fetch = require('node-fetch');
const botsettings = require('../../config.json');
const valorankAPI = require('../../functions/valorankApi')


module.exports.run = async (bot, message, args) => {
    if (!args[0]) {
        return message.channel.send({ content: "Please enter the name and tag" })
    }
    accountDetails = args.slice(0, args.length).join(' ')
    accountDetails = accountDetails.split("#")
    if (!accountDetails[0] || !accountDetails[1]) {
        return message.channel.send({ content: "Invalid player entry" })
    }
    try {

        accountJSON = await valorankAPI.getPlayer(accountDetails[0], `${accountDetails[1]}`)
        if (accountJSON.status == 404) {
            return message.channel.send({ content: "Player not found" })
        }
        AccountData = accountJSON.data

        rankJSON = await valorankAPI.getRank(accountDetails[0], accountDetails[1])
        RankData = rankJSON.data

    } catch (err){
        console.log(err)
        return message.channel.send({ content: "Internal error." })
    }
    try {

        rankRR = RankData.elo
        progressionRR = RankData.elo > 1800 ? `${rankRR - 1800} RR` : `${rankRR % 100} / 100 RR`


        responseEmbed = new Discord.MessageEmbed()
            .setTitle(`Account: ${accountDetails[0]}#${accountDetails[1]}`)
            .setThumbnail(AccountData.card["small"])
            .addFields(
                { name: "Region", value: AccountData.region },
                { name: "Level", value: AccountData.account_level.toString() },
                { name: "Rank", value: botsettings.rankicons[RankData.currenttierpatched] || botsettings.rankicons.Unranked, inline: true },
                { name: "Progression", value: `${progressionRR.toString()}`, inline: true }
            )
            .setFooter(`AccountID: ${AccountData["puuid"]}`)
        message.channel.send(await { embeds: [responseEmbed] })
    } catch { message.channel.send({ content: "Internal error. Please try again" }) }
}

module.exports.config = {
    name: "valorank",
    description: "checks a users valoant account",
    aliases: ["valoaccount"],
    usage: "valorank (name+tag)",
    permission: "PLAYER"

}