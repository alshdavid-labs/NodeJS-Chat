var Database = require('./database')
var database = new Database

module.exports  = class Accounts {
    constructor(){
        this.activeUsers = []
        this.userAccounts = {
            "david" : {
                id : 1
            },

            "jack" : {
                id : 2
            },
            "sally" : {
                id : 3
            }
        }
    }

    getAccount(username){
        if (this.userAccounts[username]){
            return this.userAccounts[username].id
        } else {
            return false
        }
    }

    loginUser(id, socketID){
        if (id){
            var data = {
                userID : id,
                socket : socketID
            }
            console.log(data)

            this.activeUsers.push(data)
            return true
        } else {
            return false
        }
    }

    

    dbTest(){
        return database.test()
    }


}