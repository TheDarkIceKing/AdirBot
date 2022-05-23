const Discord = require("discord.js")
const fetch = require('node-fetch');
const botsettings = require('../../config.json');
const { check } = require("../../functions/check_developer");


module.exports.run = async (bot, message, args) => {
    if (!args[0]) {
        return message.channel.send({ content: "Please enter the match id" })
    }
    matchId = args[0]

    try {
        matchAPIURL = `https://api.henrikdev.xyz/valorant/v2/match/${matchId}`
        matchResult = await fetch(matchAPIURL)
        matchJSON = await matchResult.json()
        MatchData = matchJSON.data

    } catch {
        return message.channel.send({ content: "Match not found" })
    }

    teamRed = MatchData.players.red
    teamBlue = MatchData.players.blue

    responseEmbed = new Discord.MessageEmbed()
        .setTitle(`Match summary`)
        .setThumbnail(botsettings.mapicons[MatchData.metadata["map"]])
        .addFields(
            { name: "Server", value: `${MatchData.metadata["cluster"]}` },
            { name: "\u200b", value: '\u200b' },
            { name: "Red team", value: `${teamRed[0].name}#${teamRed[0].tag}\n${teamRed[1].name}#${teamRed[1].tag}\n${teamRed[2].name}#${teamRed[2].tag}\n${teamRed[3].name}#${teamRed[3].tag}\n${teamRed[4].name}#${teamRed[4].tag}\n`, inline: true },
            { name: "Playing", value: `${teamRed[0].character} \n${teamRed[1].character} \n${teamRed[2].character} \n${teamRed[3].character} \n${teamRed[4].character} \n`, inline: true },
            { name: "Rank (level)", value: `${await checkRank(0, "red", MatchData)} (${teamRed[0].level}) \n${await checkRank(1, "red", MatchData)} (${teamRed[1].level}) \n${await checkRank(2, "red", MatchData)} (${teamRed[2].level}) \n${await checkRank(3, "red", MatchData)} (${teamRed[3].level}) \n${await checkRank(4, "red", MatchData)} (${teamRed[4].level}) \n`, inline: true },


            { name: "\u200b", value: '\u200b' },
            { name: "Blue team", value: `${teamBlue[0].name}#${teamBlue[0].tag} \n${teamBlue[1].name}#${teamBlue[1].tag} \n${teamBlue[2].name}#${teamBlue[2].tag} \n${teamBlue[3].name}#${teamBlue[3].tag} \n${teamBlue[4].name}#${teamBlue[4].tag} \n`, inline: true },
            { name: "Playing", value: `${teamBlue[0].character} \n${teamBlue[1].character} \n${teamBlue[2].character} \n${teamBlue[3].character} \n${teamBlue[4].character} \n`, inline: true },
            { name: "Rank (level)", value: `${await checkRank(0, "blue", MatchData)} (${teamBlue[0].level})\n${await checkRank(1, "blue", MatchData)} (${teamBlue[1].level})\n${await checkRank(2, "blue", MatchData)} (${teamBlue[2].level}) \n${await checkRank(3, "blue", MatchData)} (${teamBlue[3].level}) \n${await checkRank(4, "blue", MatchData)} (${teamBlue[4].level}) \n`, inline: true }
            //    {name: "Region", value: AccountData.region},
            //    {name: "Level", value: AccountData.account_level.toString()},
            //    {name: "Rank", value: RankData.currenttierpatched || "Unranked", inline: true},
            //    {name: "Progression", value: `${progressionRR.toString()}`, inline: true}
        )
    message.channel.send(await { embeds: [responseEmbed] });

    async function checkRank(player, team, MatchDataResolved) {
        if (MatchDataResolved.players[team][player].currenttier_patched == "Unrated") {
            rankAPIURL = `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${MatchDataResolved["metadata"]["region"]}/${MatchDataResolved.players[team][player]["puuid"]}`
            rankResult = await fetch(rankAPIURL)
            rankJSON = await rankResult.json()
            RankData = rankJSON.data
            return botsettings.rankicons[RankData.currenttierpatched]
        } else {
            return MatchDataResolved.players[team][player].currenttier_patched
        }
    }


}

module.exports.config = {
    name: "valomatch",
    description: "checks a users valoant account",
    aliases: ["matchchecker"],
    usage: "valoaccount (name+tag)",
    permission: "PLAYER"

}