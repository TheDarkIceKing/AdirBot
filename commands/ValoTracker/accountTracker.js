const Discord = require("discord.js")
const fetch = require('node-fetch');
const botsettings = require('../../config.json');
const valorankAPI = require('../../functions/valorankApi')
const Canvas = require("canvas")


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
        if (accountJSON.status == 429) {
            return message.channel.send({ content: "API ratelimit. Cannot lookup user" })
        }
        AccountData = accountJSON.data || null
        // console.log(AccountData)

        // console.log(await valorankAPI.getPeak(accountDetails[0], accountDetails[1]))
        rankJSON = await valorankAPI.getRank(AccountData.region, accountDetails[0], accountDetails[1]) || null
        RankData = rankJSON.data

    } catch (err) {
        console.log(err)
        return message.channel.send({ content: "Internal error." })

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
        message.channel.send({ files: [canvas.toBuffer()] })




        // responseEmbed = new Discord.MessageEmbed()
        //     .setTitle(`Account: ${accountDetails[0]}#${accountDetails[1]}`)
        //     .setThumbnail(AccountData.card["small"])
        //     .addFields(
        //         { name: "Region", value: AccountData.region },
        //         { name: "Level", value: AccountData.account_level.toString() },
        //         { name: "Rank", value: botsettings.rankicons[RankData.currenttierpatched] || botsettings.rankicons.Unranked, inline: true },
        //         { name: "Progression", value: `${progressionRR.toString()}`, inline: true }
        //     )
        //     .setFooter(`AccountID: ${AccountData["puuid"]}`)
        // // message.channel.send(await { embeds: [responseEmbed] })
        // message.channel.send({ files:[`./Content/${RankData.currenttierpatched.toLowerCase()}.png`]})

    } catch (err) {
        console.log(err)
        message.channel.send({ content: "Internal error. Please try again" })
    }
}

module.exports.config = {
    name: "valorank",
    description: "checks a users valoant account",
    aliases: ["valoaccount"],
    usage: "valorank (name+tag)",
    permission: "PLAYER"

}