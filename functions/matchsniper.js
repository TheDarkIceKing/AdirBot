const fetch = require('node-fetch');
const Discord = require('discord.js')
const botsettings = require('../config.json');
const snipe_tracker = require('./snipe_tracker');

module.exports = {
    start: async function (bot) {
        roller = setInterval(async function(){
            snipeUsers = await snipe_tracker.getAllSnipers()
            snipeUsers.forEach(async (selectedUser)  => {
                matchHistoryURL = `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/eu/${selectedUser.puuid}`
                matchResult = await fetch(matchHistoryURL);
                matchJSON = await matchResult.json()
                matchData = matchJSON.data[0] || matchJSON.data[1]
                
                lastMatchId = matchData.metadata.matchid
                if(selectedUser.lastKnownMatch != lastMatchId){
                    playername = (matchJSON.data[0].players.all_players).filter( element => element.puuid ==selectedUser.puuid)
                    newMatchEmbed = new Discord.MessageEmbed()
                    .setTitle("New match found")
                    .setThumbnail(botsettings.mapicons[matchData.metadata["map"]])
                    .addFields(
                        {name: "Player", value: playername[0].name},
                        {name: "MatchID", value: lastMatchId},
                        {name: "Mode", value: matchData.metadata.mode}
                    )
                    sendMessage = bot.channels.cache.get(botsettings.discord.sniperchannelid)
                    snipe_tracker.updateSnipe(selectedUser.puuid, lastMatchId)
                    
                    sendMessage.send({embeds: [newMatchEmbed]})
                }
            })
        },30000)
    }

}