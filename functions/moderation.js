const sqlite = require('sqlite3').verbose();


module.exports = {
    ban: async function (userid, reason, duration, appealable, msg) {
        let db = new sqlite.Database(`./DataFiles/Punishments.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        try {
            var now = new Date()
            var member = msg.channel.guild.members.cache.get(userid)
            db.run(`INSERT INTO punishments VALUES("${userid}", ?, "Ban", "${now}", "${duration}", "true", "${reason}", "${appealable}")`)
            member.ban({reason: `${reason}`})
            msg.reply(`User has been banned (<@${userid}>)`)

        } catch (err) {
            console.log(err)
            msg.reply("Ban failed")
        }
        db.close()
    },
    kick: async function (userid, reason, msg) {
        let db = new sqlite.Database(`./DataFiles/Punishments.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        try {
            var now = new Date()
            var member = msg.channel.guild.members.cache.get(userid)
            db.run(`INSERT INTO punishments VALUES("${userid}", ?, "Kick", "${now}", "0", "false", "${reason}", "false")`)
            member.kick()
            msg.reply(`User has been kicked (<@${userid}>)`)

        } catch (err) {
            console.log(err)
            msg.reply("kick failed")
        }
        db.close()
    },
    checkban: async function (userid) {
        
        return new Promise(async (res) => {
            let db = new sqlite.Database(`./DataFiles/Punishments.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
            db.configure("busyTimeout", 10000)
            let query = `SELECT Expires, PunishmentID FROM punishments WHERE UserID = "${userid}" AND Active = "true" AND Punishment = "Ban"`;
            db.get(query, (err, row) => {
                if (err) {
                    console.log(err)
                    return;
                }
                if (row == undefined) {
                    res("false")
                    return;
                } else {
                    try{
                    var Expired = new Date(row.Expires)
                    var Now = new Date()
                    if (Expired > Now) {
                        res(Expired)
                    } else {
                        db.run(`UPDATE punishments SET active = "false" WHERE PunishmentID = "${row.PunishmentID}"`)
                        res("false")
                    }
                } catch{
                    res("Never")
                }
                }
            })
            db.close()
        })
    },
    warn: async function (userid, reason) {
        let db = new sqlite.Database(`./DataFiles/Punishments.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        try {
            var now = new Date()
            db.run(`INSERT INTO punishments VALUES("${userid}", ?, "Warning", "${now}", "0", "false", "${reason}", "false")`)
        } catch (err) {
            console.log(err)
        }
        db.close()
    }

}