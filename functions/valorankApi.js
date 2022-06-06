const { match } = require("assert");
const ValorantAPI = require("unofficial-valorant-api")
const botsettings = require('../config.json');

module.exports = {
    getPlayer: async function (name, tag) {
        return await ValorantAPI.getAccount(name, tag)
    },
    getRank: async function (region, name, tag) {
        return await ValorantAPI.getMMR("v1", region, name, tag)
    },
    getPeak: async function (name, tag) {
        try {
            valorantAccount = await ValorantAPI.getAccount(name, tag)

            fullhistoryMMR = await ValorantAPI.getMMR("v2", "eu", name, tag)
            compacthistoryMMR = fullhistoryMMR.data.by_season
            console.log(compacthistoryMMR)


        } catch (err) {
            console.log(err)
            return "ERROR"
        }
    },
    getMatch: async function (matchid){
        valomatch = await ValorantAPI.getMatch(matchid)
        return valomatch
    }



    ,
    getHighestRank: async function(sortItem) {
        highest = 0
        sortItem.forEach((selectedItem) => {
            if (selectedItem.final_rank > highest){
                highest = selectedItem.final_rank
            }
        })
        return highest

    }
}