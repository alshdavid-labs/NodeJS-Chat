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

    loginUser(email, socketID){
        return new Promise ( function(resolve, reject) {
            if (email && socketID){
                var data = {}

                // get users details & apend to response object
                database.getUserDetails(email).then( (res) => {
                    if (res.length == 0) {
                        return reject("Invalid User")
                    }
                    data['account'] = res[0]

                    //get users conversations & apend to response object
                    database.getConversations(res[0]._id).then ( (res) => {
                        data['conversations'] = res 

                        //get all active users & apend to response object
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

    createUser(email, username){
        return new Promise ( function(resolve, reject) {
            database.userUniqueEmail(email).then((res)=>{
                if (res.length == 0) {
                    database.createUser(email, username).then((res)=>{
                        resolve(res)  
                    })
                } else { 
                    reject ("user already exists")
                }
            })
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