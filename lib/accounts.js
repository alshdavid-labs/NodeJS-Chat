var Database = require('./database')
var database = new Database

var sessions = []

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

                        database.getAllUsers().then( (res)=> {
                            data['users'] = res
                            //create session
                            sessions.push(
                                { 
                                    'userID' : data.account._id, 
                                    'socket' : socketID 
                                })
                            console.log("Login:    " + socketID)
                            //return response object
                            resolve(data)  

                        })
                    })
                })
            } else {
                reject("incorrect name")
            }
        })
    }

    getSessions(){
        return sessions
    }

    removeSession(socketID){
        var newSessions = []
        for (let i = 0; i < sessions.length; i++){
            if (sessions[i].socket != socketID){
                newSessions.push(sessions[i])
            }
        }
        sessions = newSessions
        console.log("Logout:   " + socketID)
    }

   


}