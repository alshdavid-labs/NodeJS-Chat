var co = require('co');

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
            if (!email || !socketID){return reject("incorrect name");}

            co(function *(){
                var userDetails = yield database.getUserDetails(email)
                var myConversations = yield database.getConversations(userDetails)
                var allUsers = yield database.getAllUsers()

                var data = {}
                data['account'] = userDetails
                data['conversations'] = myConversations 
                data['users'] = allUsers

                sessions.push({ 
                    'userID' : data.account._id, 
                    'socket' : socketID 
                })

                console.log("Login:    " + socketID)
                resolve(data)  
            })
            .catch( res => { reject (res) } )
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