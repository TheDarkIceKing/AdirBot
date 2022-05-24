
const Discord = require("discord.js")
const sqlite = require('sqlite3').verbose();
const fetch = require('node-fetch')

module.exports = {
    addSnipe: function (playerid, lastKnownMatch) {
        let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        db.run(`INSERT INTO playersSniped VALUES ("${playerid}", "${lastKnownMatch}")`)
    },
    removesnipe: function (playerid){
        let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        db.run(`DELETE FROM playersSniped WHERE puuid = "${playerid}"`)
    },
    updateSnipe: function (playerid, lastKnownMatch) {
        let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        db.run(`UPDATE 'playersSniped' SET lastKnownMatch = "${lastKnownMatch}" WHERE puuid = "${playerid}"`)
        db.close()
    },
    checksnipe: async function (player) {
        return new Promise((res) => {
            let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
            db.configure("busyTimeout", 10000)
            let query = `SELECT * FROM playersSniped WHERE puuid = "${player}"`;
    
            db.all(query, async (err, row) => {
                if (err) {
                    console.log(err)
                    res(null)
                }
                if (row == undefined) {
                    res(false)
                } else {
                    if(row.length == 0) return res(false)
                    res(true)
                }
            })
                db.close()
        });
    },
    getsnipercounter: async function(){
        return new Promise((res) => {
            let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
            db.configure("busyTimeout", 10000)
            let query = `SELECT * FROM playersSniped`;
    
            db.all(query, async (err, row) => {
                if (err) {
                    console.log(err)
                    res(null)
                }
                if (row == undefined) {
                    res(false)
                } else {
                    res(row.length)
                }
            })
                db.close()
        });
    },
    getAllSnipers: async function(){
        return new Promise((res) => {
            let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
            db.configure("busyTimeout", 10000)
            let query = `SELECT * FROM playersSniped`;
    
            db.all(query, async (err, row) => {
                if (err) {
                    console.log(err)
                    res(null)
                }
                if (row == undefined) {
                    res(null)
                } else {
                    res(row)
                }
            })
                db.close()
        });
    }

}