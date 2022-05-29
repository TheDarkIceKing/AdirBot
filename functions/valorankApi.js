const ValorantAPI = require("unofficial-valorant-api")

module.exports = {
    getPlayer: async function (name, tag) {
        return await ValorantAPI.getAccount(name, tag)
    },
    getRank: async function (name, tag) {
        return await ValorantAPI.getMMR("v1", "eu", name, tag)
    }
}