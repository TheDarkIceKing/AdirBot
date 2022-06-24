const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const valorankApi = require("../../functions/valorankApi")
const sorter = require("sort-nested-json");
const Canvas = require("canvas")


const fetch = require('node-fetch');
const botsettings = require('../../config.json');
const valorankAPI = require('../../functions/valorankApi')

module.exports = {
 
    data: new SlashCommandBuilder()
        .setName("valorank")
        .setDescription("Lookup a players rank")
        .addStringOption(option => option.setName('player').setDescription('The playername and tag you want to lookup ').setRequired(true)),
    async execute(bot, interaction) {
   
        interaction.deferReply({ content: "Getting data." }).then(async () => {
        accountDetails =  interaction.options.getString("player")
        accountDetails = accountDetails.split("#")
        if (!accountDetails[0] || !accountDetails[1]) {
            return interaction.editReply({ content: "Invalid player entry", ephemeral: true })
        }
        try {
    
            accountJSON = await valorankAPI.getPlayer(accountDetails[0], `${accountDetails[1]}`)
            if (accountJSON.status == 404) {
                return interaction.editReply({ content: "Player not found", ephemeral: true })
            }
            if (accountJSON.status == 429) {
                return interaction.editReply({ content: "API ratelimit. Cannot lookup user", ephemeral: true})
            }
            AccountData = accountJSON.data || null
            // console.log(AccountData)
    
            // console.log(await valorankAPI.getPeak(accountDetails[0], accountDetails[1]))
            rankJSON = await valorankAPI.getRank(AccountData.region, accountDetails[0], accountDetails[1]) || null
            RankData = rankJSON.data
    
        } catch (err) {
            console.log(err)
            return interaction.editReply({ content: "Internal error.",ephemeral: true })
    
        }
        try {
    
            rankRR = RankData.elo
            progressionRR = (RankData.elo > 2100 ? rankRR - 2100 : rankRR % 100 / 100) || 0
    
    
            const canvas = Canvas.createCanvas(1920, 1080)
            const ctx = canvas.getContext("2d");
            const background = await Canvas.loadImage(`./Content/ValorantAssets/agentunlock.png`)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    
            let rank = await (Canvas.loadImage(`./Content/Ranks/unranked.png`))
            let playercard = await (Canvas.loadImage(`https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/largeart.png`))
    
            try {
                rank = await (Canvas.loadImage(`./Content/Ranks/${RankData.currenttierpatched.toLowerCase()}.png`))
                playercard = await (Canvas.loadImage((AccountData.card["large"])))
            } catch { }
    
    
            //images
            ctx.drawImage(playercard, 790, 0, 405, 1000);
            ctx.drawImage(rank, 1050 - rank.width / 2, 700, 100, 100);
    
            //RRBar
            ctx.lineJoin = "round"
            ctx.lineWidth = 10
            // Empty
            ctx.strokeStyle = "#5D6D90"
            ctx.strokeRect(465, 850, 1000, 10)
            ctx.lineWidth = 8
            //FULL
            ctx.strokeStyle = "#11e6f5"
            ctx.strokeRect(465, 851, RankData.elo > 2100 ? 1000 : 1000 * progressionRR, 8)
    
            //Name
            ctx.globalAlpha = 0.5
            ctx.strokeStyle = "Black"
            ctx.lineWidth = 50
            ctx.strokeRect(800, 600, 390, 0)
            ctx.globalAlpha = 1
    
            //Name
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.font = "bold 40px Sans"
            ctx.fillText(accountDetails[0], 990, 610, playercard.width)
    
            //LevelBack
            ctx.globalAlpha = 0.5
            ctx.strokeStyle = "Black"
            ctx.lineWidth = 50
            ctx.strokeRect(940, 660, 100, 0)
            ctx.globalAlpha = 1
    
            //Level
            ctx.fillStyle = "Cyan"
            ctx.textAlign = "center"
            ctx.font = "bold 35px Sans"
            ctx.fillText(AccountData.account_level, 990, 670, playercard.width)
    
    
    
            //RR
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.font = "bold 25px Sans"
    
            ranktext = RankData.elo > 1800 ? `${Math.round(progressionRR)}RR` : `${Math.round(progressionRR * 100)}/100RR`
            ctx.fillText(ranktext, 1500, 800)
    
            ctx.fillStyle = RankData["mmr_change_to_last_game"] > 0 ? "lime" : "red"
            ctx.textAlign = "center"
            ctx.font = "bold 25px Sans"
            ctx.fillText(`${RankData["mmr_change_to_last_game"] || 0}`, 990, 950)
    
            //UUID
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.font = "bold 20px Sans"
            ctx.fillText(AccountData["puuid"] || "Not found", 400, 1050)
    
    
    
    
            // const attachmentimage = new Discord.MessageAttachment(, 'rank.png')
            return interaction.editReply({ files: [canvas.toBuffer()] })
        } catch {interaction.editReply({content: "Interaction error",ephemeral: true})}
    
    })}
}


module.exports.config = {
    permission: "PLAYER"
}