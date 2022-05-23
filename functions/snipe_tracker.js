const sqlite = require('sqlite3').verbose();

module.exports = {
    newsnipe : function () {
        
    },
    addSnipe : function (playerid, lastKnownMatch){

    },
    updateSnipe : function (playerid, lastKnownMatch){
        let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.run(`UPDATE playersSniped SET lastKnownMatch = "${lastKnownMatch}" WHERE puuid = "${playerid}"`)
        db.close()
    },
    getactivesnipes: function (message){
        allSnipes = "```";
        let db = new sqlite.Database('./Data/userSniped.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)
        db.configure("busyTimeout", 10000)
        let query = `SELECT * FROM playersSniped`;
        db.all(query, (err, row) => {
            if (err) {
                console.log(err)
                return;
            }
            if (row == undefined) {
                return;
            } else {
                allSnipes += `${row.puuid}`
            }
        })
        db.close()
    }

}