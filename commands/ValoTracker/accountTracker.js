const Discord = require("discord.js")
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
    AccountData = accountJSON.data
 
    rankAPIURL = `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${AccountData.region}/${AccountData.puuid}`
    rankResult = await fetch(rankAPIURL)
    rankJSON = await rankResult.json()
    RankData = rankJSON.data
 
   } catch {
    return message.channel.send({content: "Account not found"})
   }
   
   rankRR = RankData.elo
   progressionRR = RankData.elo > 1800 ? `${rankRR - 1800} RR` : `${rankRR % 100} / 100 RR`


   responseEmbed = new Discord.MessageEmbed()
   .setTitle(`Account: ${accountDetails[0]}#${accountDetails[1]}`)
   .setThumbnail(AccountData.card["small"])
   .addFields(
       {name: "Region", value: AccountData.region},
       {name: "Level", value: AccountData.account_level.toString()},
       {name: "Rank", value: RankData.currenttierpatched || "Unranked", inline: true},
       {name: "Progression", value: `${progressionRR.toString()}`, inline: true}
   )
   message.channel.send(await {embeds: [responseEmbed]})
}

module.exports.config = {
    name: "valorank",
    description: "checks a users valoant account",
    aliases: ["valoaccount"],
    usage: "valorank (name+tag)",
    permission: "PLAYER"

}