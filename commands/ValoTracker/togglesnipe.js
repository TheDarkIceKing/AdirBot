const sniper = require('../../functions/snipe_tracker');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
    if(!args[0]){
        return message.channel.send({content: "Please enter the name and tag"})
    }
    accountDetails = args.slice(0, args.length).join(' ')
    accountDetails = accountDetails.split("#")
    if(!accountDetails[0] || !accountDetails[1]){
        return message.channel.send({content: "Invalid player"})
    }
    try{
     accountAPIURL = `https://api.henrikdev.xyz/valorant/v1/account/${accountDetails[0]}/${accountDetails[1]}`
    
     accountResult = await fetch(accountAPIURL);
     accountJSON = await accountResult.json()
     AccountID = accountJSON.data.puuid
    
    } catch {
     return message.channel.send({content: "Account not found"})
    }

    if(await sniper.checksnipe(AccountID) == true){
        sniper.removesnipe(AccountID)
        message.channel.send({content: "Sniper disabled"})
    } else {
        matchHistoryURL = `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/eu/${AccountID}`
        matchResult = await fetch(matchHistoryURL);
        matchJSON = await matchResult.json()
        lastMatchId = matchJSON.data[0].metadata.matchid
        sniper.addSnipe(AccountID, lastMatchId)
        message.channel.send({content: "Sniper enabled"})
    }


}

module.exports.config = {
    name: "valosnipe",
    description: "toggle the valosnipe",
    aliases: ["sniper"],
    usage: "valosnipe (name+tag)",
    permission: "PLAYER"
}