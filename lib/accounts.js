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
                var myConversations = yield database.getConversationsByID(userDetails._id)
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
            co(function *(){
                var userEmail = yield database.userUniqueEmail(email)
                if (userEmail.length != 0) { reject ("user already exists"); return }

                var newUser = yield database.createUser(email, username)
                resolve(newUser)
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

    getActiveSessionsFromIds(ids){
        var active = []
        for (let i = 0; i < ids.length ; i++){
            compareSessions(ids[i])
        }
        function compareSessions(id){
            for (let i = 0; i < sessions.length; i++ ){
                if (sessions[i].userID == id){ 
                    active.push(sessions[i].socket.toString())
                }
            }
        }
        return active
    }


}