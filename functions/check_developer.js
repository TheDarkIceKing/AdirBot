module.exports = {
    check: function (userid) {
        return new Promise((res) => {
            developers = ["581562019639984230"]
            if(developers.includes(userid)){
                res(true)
            }
            else {
                res(false)
            }
        });
    }

}