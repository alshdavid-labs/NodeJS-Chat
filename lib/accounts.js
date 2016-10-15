var Database = require('./database')
var database = new Database

var sessions = {}

module.exports  = class Accounts {
    constructor(){}

    getAccount(username){
        if (this.userAccounts[username]){
            return this.userAccounts[username].id
        } else {
            return false
        }
    }

    loginUser(username, socketID){
        return new Promise ( function(resolve, reject) {
            if (username && socketID){
                var data = {}

                // get users details & apend to response object
                database.getUserDetails(username).then( (res) => {
                    data['account'] = res[0]

                    //get users conversations & apend to response object
                    database.getConversations(res[0]._id).then ( (res) => {
                        data['conversations'] = res 
                        
                        //create session
                        sessions[socketID] = { userID : data.account._id }
                        console.log(sessions)
                        //return response object
                        resolve(data)
                    })
                })
            } else {
                reject("incorrect name")
            }
        })
    }

   


}