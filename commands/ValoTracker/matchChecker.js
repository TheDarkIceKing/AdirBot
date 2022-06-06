const Discord = require("discord.js")
const valorankApi = require("../../functions/valorankApi")
const sorter = require("sort-nested-json");
const Canvas = require("canvas")


module.exports.run = async (bot, message, args) => {
    matchid = args[0]
    valorankApi.getMatch(matchid)


    if (!args[0]) {
        return message.channel.send({ content: "Please enter the match id" })
    }
    matchId = args[0]

    message.channel.send({ content: "Getting data." }).then(async (sentMessage) => {

        try {

            matchJSON = await valorankApi.getMatch(matchId)
            if (matchJSON.status == 404) {
                return message.channel.send({ content: "Match not found" })
            }
            if (matchJSON.status == 429) {
                return message.channel.send({ content: "API ratelimit. Cannot lookup user" })
            }
            MatchData = matchJSON.data
            if (MatchData.metadata.mode == "Deathmatch") { return message.channel.send({ content: "This mode is currently not supported" }) }
            teamRed = MatchData.players["all_players"].filter(function (i, n) {
                return i.team === 'Red';
            })
            teamRed = sorter.sort(teamRed).desc("stats.kills")
            teamBlue = MatchData.players["all_players"].filter(function (i, n) {
                return i.team === 'Blue';
            })
            teamBlue = sorter.sort(teamBlue).desc("stats.kills")

            const canvas = Canvas.createCanvas(769, 375)
            const ctx = canvas.getContext("2d");
            const scoreboardbackground = await Canvas.loadImage(`./Content/ValorantAssets/scoreboardplaceholder.png`)


            const canvas2 = Canvas.createCanvas(769, 137)
            const ctx2 = canvas2.getContext("2d");

            roundswon = {
                Red: 0,
                Blue: 0
            }

            ctx.drawImage(scoreboardbackground, 0, 0, canvas.width, canvas.height);
            // 70, 45 first item == 35 each
            currentY = 50
            ctx.fillStyle = "white"
            ctx.font = "bold 10px Sans"

            for (i = 0; i < teamBlue.length; i++) {
                agent = teamBlue[i].character == "KAY/O" ? "Kayo" : teamBlue[i].character
                agentimage = await Canvas.loadImage(`./Content/Agents/${agent}.png`)

                ctx.drawImage(agentimage, 10, currentY - 21, 50, 34)
                ctx.textAlign = "left"
                ctx.fillText(`${teamBlue[i].name} #${teamBlue[i].tag}`, 90, currentY, 275)
                ctx.textAlign = "center"
                ctx.fillText(`${teamBlue[i].stats.kills} / ${teamBlue[i].stats.deaths} / ${teamBlue[i].stats.assists}`, 420, currentY, 100)
                rank = await (await valorankApi.getRank(MatchData.metadata.region, teamBlue[i].name, teamBlue[i].tag)).data.currenttierpatched || "Unranked"
                rankImage = await (Canvas.loadImage(`./Content/Ranks/${rank}.png`))
                ctx.drawImage(rankImage, 650, currentY - 21, 40, 34)
                ctx.fillText(`${teamBlue[i].level}`, 750, currentY, 100)
                currentY += 34
            }
            currentY = 228
            for (i = 0; i < teamRed.length; i++) {
                agent = teamRed[i].character == "KAY/O" ? "Kayo" : teamRed[i].character
                agentimage = await Canvas.loadImage(`./Content/Agents/${agent}.png`)

                ctx.drawImage(agentimage, 10, currentY - 21, 50, 34)
                ctx.textAlign = "left"
                ctx.fillText(`${teamRed[i].name} #${teamRed[i].tag}`, 90, currentY, 275)
                ctx.textAlign = "center"
                ctx.fillText(`${teamRed[i].stats.kills} / ${teamRed[i].stats.deaths} / ${teamRed[i].stats.assists}`, 420, currentY, 100)
                rank = await (await valorankApi.getRank(MatchData.metadata.region, teamRed[i].name, teamRed[i].tag)).data.currenttierpatched || "Unranked"
                rankImage = await (Canvas.loadImage(`./Content/Ranks/${rank}.png`))
                ctx.drawImage(rankImage, 650, currentY - 21, 40, 34)
                ctx.fillText(`${teamRed[i].level}`, 750, currentY, 100)
                currentY += 34
            }
            const scorebackground = await Canvas.loadImage(`./Content/ValorantAssets/matchScorePlaceholder.png`)
            ctx2.drawImage(scorebackground, -196, 0, scorebackground.width, scorebackground.height)
            const map = await Canvas.loadImage(`./Content/Maps/${MatchData.metadata.map}.png`)
            for (i=0; i < MatchData.rounds.length; i++){
                if(MatchData.rounds[i].end_type == "Surrendered") break;
                roundswon[MatchData.rounds[i].winning_team] += 1
            }
            ctx2.drawImage(map, 310, 10, 150,80)
            ctx2.fillStyle = "white"
            ctx2.font = "30px Sans"
            ctx2.fillText(`${await roundswon.Blue}`, 230, 55)
            ctx2.fillText(`${await roundswon.Red}`, 520, 55)
            ctx2.font = "20px Sans"
            ctx2.fillText(`${MatchData.metadata.mode}`, 50, 55 )
            ctx2.fillText(`${MatchData.metadata.cluster}`, 600, 55)

            const finalcanvas = Canvas.createCanvas(canvas.width, canvas.height + canvas2.height)
            const finalctx = finalcanvas.getContext("2d");
            finalctx.drawImage(canvas2, 0,0, canvas2.width, canvas2.height)
            finalctx.drawImage(canvas ,0, canvas2.height, canvas.width, canvas.height)
            
            message.channel.send({files: [finalcanvas.toBuffer()]}).then(() => {
                sentMessage.delete()
            })


            // message.channel.send({ files: [canvas2.toBuffer()] }).then(() =>{
            //     message.channel.send({ files: [canvas.toBuffer()] })
            //     
            // })


        } catch (err) {
            return console.log(err)
        }
    })
    
}

module.exports.config = {
    name: "valomatch",
    description: "checks a users valorant match",
    aliases: ["matchchecker"],
    usage: "valoaccount (name+tag)",
    permission: "PLAYER"
}