const Discord = require("discord.js")
const fetch = require('node-fetch');
const botsettings = require('../../config.json');


module.exports.run = async (bot, message, args) => {
    if (!args[0]) {
        return message.channel.send({ content: "Please enter the match id" })
    }
    matchId = args[0]

    message.channel.send({ content: "Getting data..." }).then(async (sentMessage) => {
        try {
            matchAPIURL = `https://api.henrikdev.xyz/valorant/v2/match/${matchId}`
            matchResult = await fetch(matchAPIURL)
            matchJSON = await matchResult.json()
            MatchData = matchJSON.data
            teamRed = MatchData.players.red
            teamBlue = MatchData.players.blue
            if(MatchData.metadata.mode == "Deathmatch") return message.channel.send({content: "Deatchmatch is currently not supported"})

        } catch {
            return message.channel.send({ content: "Match not found" })
        }

        keepalive(sentMessage)


        responseEmbed = new Discord.MessageEmbed()
            .setTitle(`Match summary`)
            .setThumbnail(botsettings.mapicons[MatchData.metadata["map"]])
            .addFields(

                { name: "MatchID", value: matchId },
                { name: "Server", value: `${MatchData.metadata["cluster"]}`, inline: false },
                { name: "\u200b", value: '\u200b' },
                { name: "Mode", value: MatchData.metadata["mode"], inline: true }
            )
        loadMatchSummary(MatchData)

        responseEmbed.addFields(
            /// TEAM RED
            { name: "\u200b", value: '\u200b' },
            { name: "Red team", value: `${teamRed[0].name}#${teamRed[0].tag}\n${teamRed[1].name}#${teamRed[1].tag}\n${teamRed[2].name}#${teamRed[2].tag}\n${teamRed[3].name}#${teamRed[3].tag}\n${teamRed[4].name}#${teamRed[4].tag}\n`, inline: true },
            { name: "Playing", value: `${await checkAgent(0, "red", MatchData)} \n${await checkAgent(1, "red", MatchData)} \n${await checkAgent(2, "red", MatchData)} \n${await checkAgent(3, "red", MatchData)} \n${await checkAgent(4, "red", MatchData)} \n`, inline: true },
            { name: "Rank (level)", value: `${await checkRank(0, "red", MatchData)} (${teamRed[0].level}) \n${await checkRank(1, "red", MatchData)} (${teamRed[1].level}) \n${await checkRank(2, "red", MatchData)} (${teamRed[2].level}) \n${await checkRank(3, "red", MatchData)} (${teamRed[3].level}) \n${await checkRank(4, "red", MatchData)} (${teamRed[4].level}) \n`, inline: true },

            // TEAM BLUE
            { name: "\u200b", value: '\u200b' },
            { name: "Blue team", value: `${teamBlue[0].name}#${teamBlue[0].tag} \n${teamBlue[1].name}#${teamBlue[1].tag} \n${teamBlue[2].name}#${teamBlue[2].tag} \n${teamBlue[3].name}#${teamBlue[3].tag} \n${teamBlue[4].name}#${teamBlue[4].tag} \n`, inline: true },
            { name: "Playing", value: `${await checkAgent(0, "blue", MatchData)} \n${await checkAgent(1, "blue", MatchData)} \n${await checkAgent(2, "blue", MatchData)} \n${await checkAgent(3, "blue", MatchData)} \n${await checkAgent(4, "blue", MatchData)} \n`, inline: true },
            { name: "Rank (level)", value: `${await checkRank(0, "blue", MatchData)} (${teamBlue[0].level})\n${await checkRank(1, "blue", MatchData)} (${teamBlue[1].level})\n${await checkRank(2, "blue", MatchData)} (${teamBlue[2].level}) \n${await checkRank(3, "blue", MatchData)} (${teamBlue[3].level}) \n${await checkRank(4, "blue", MatchData)} (${teamBlue[4].level}) \n`, inline: true },

            //KDA
            { name: "\u200b", value: '\u200b' },


        )
        await loadKDA(MatchData)

        sentMessage.edit({ content: " ", embeds: [await responseEmbed] })


    })

    async function checkRank(player, team, MatchDataResolved) {
        try {
            if (MatchDataResolved.players[team][player].currenttier_patched == "Unrated") {
                rankAPIURL = `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${MatchDataResolved["metadata"]["region"]}/${MatchDataResolved.players[team][player]["puuid"]}`
                rankResult = await fetch(rankAPIURL)
                rankJSON = await rankResult.json()
                RankData = await rankJSON.data
                return botsettings.rankicons[await RankData.currenttierpatched] || botsettings.rankicons.Unranked
            } else {
                return botsettings.rankicons[MatchDataResolved.players[team][player].currenttier_patched]
            }
        } catch { return "ERROR" }
    }

    async function checkAgent(player, team, MatchDataResolved) {
        equippedAgent = MatchDataResolved.players[team][player].character
        playingRole = botsettings.agents[equippedAgent].role
        roleIcon = botsettings.Roles[playingRole]
        return `${botsettings.agents[equippedAgent].icon} ${roleIcon}`
    }

    async function loadKDA(MatchDataResolved) {
        playerList = "***RED TEAM***\n"
        playerKDA = "\u200b\n"

        players = MatchDataResolved.players["red"]
        players.forEach((selectedPlayer) => {
            stats = selectedPlayer.stats
            playerList += `${selectedPlayer.name}\n`
            playerKDA += `${stats.kills}/${stats.deaths}/${stats.assists}\n`

        })
        playerList += "\u200b\n***BLUE TEAM***\n"
        playerKDA += "\u200b\n\u200b\n"
        players = MatchDataResolved.players["blue"]
        players.forEach((selectedPlayer) => {
            stats = selectedPlayer.stats
            playerList += `${selectedPlayer.name}\n`
            playerKDA += `${stats.kills}/${stats.deaths}/${stats.assists}\n`

        })
        responseEmbed.addFields(
            { name: "Player", value: playerList, inline: true },
            { name: "Performace", value: playerKDA, inline: true }
        )
    }
    async function loadMatchSummary(MatchDataResolved) {

        gameSummary = ""
        //red team is first
        gameScore = [0, 0]
        rounds = MatchDataResolved.rounds
        rounds.forEach((selectedRound) => {
            if (selectedRound["winning_team"] == "Red") {
                gameScore[0] += 1
            }
            if (selectedRound["winning_team"] == "Blue") {
                gameScore[1] += 1
            }
        })
        responseEmbed.addFields(
            // { name: "\u200b", value: '\u200b' },
            { name: "Score", value: `${gameScore[0]}-${gameScore[1]}`, inline: true }
        )
        return
    }
    async function keepalive(sentMessage) {
        showNotFrozen = setInterval(function () {

            if (sentMessage.content == "Getting data...") {
                return sentMessage.edit({ content: "Getting data.." })
            } else {
                if (!sentMessage.content.includes("data")) {
                    clearInterval(showNotFrozen);
                    return sentMessage.edit({ content: " " })
                }
                else {
                   return sentMessage.edit({ content: "Getting data..."})
                }
                
            }

        }, 800)
    }
}

module.exports.config = {
    name: "valomatch",
    description: "checks a users valorant match",
    aliases: ["matchchecker"],
    usage: "valoaccount (name+tag)",
    permission: "PLAYER"
}