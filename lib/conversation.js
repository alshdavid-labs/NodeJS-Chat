var Database = require('./database')
var Accounts = require('./accounts')

var database = new Database

module.exports  = class Conversation {
    constructor(){}

    create(socketID, fromUser, userIDs){
        var userList = userIDs
        userList.push(fromUser)

        console.log(userList)

        return new Promise ( function(resolve, reject) {
            if ( checkUserOwnsSocket(socketID, fromUser) ) {
                if ( checkForDuplicates(userList) ) {
                    database.checkExistingConversation(userList).then((res)=>{
                        if (res.length == 0){
                            database.createConversation(userIDs).then((conversation)=>{
                                resolve(conversation)
                            })
                        } else {
                            console.log("BOUNCED:  convo exists")
                            reject("conversation exsists")
                        }
                    })
                } else {
                    console.log("BOUNCED:  duplicate users in convo")
                    reject("duplicate entries")
                }
            } else {
                console.log('')
                reject("you don't own session")
            }
            
            
        })

        function checkUserOwnsSocket(socketID, user){
            var accounts = new Accounts
            var sessions = accounts.getSessions()            
            for (let i = 0; i < sessions.length; i++) {
                if (sessions[i].socket == socketID){
                    if ( sessions[i].userID == user){
                        return true
                    } else {
                        return false
                    }
                }
            }
        }

        function checkForDuplicates(userList){
            var repeats = 0
            for (let i = 0; i < userList.length; i++){
                for (let y = 0; y < userList.length; y++){
                    if (userList[i] == userList[y]){
                        repeats++
                    }
                }
            }
            if (repeats == userList.length){
                return true
            } else {
                return false
            }
        }
        
    }


    newMessage(userID, conversation, msg){
        var accounts = new Accounts
        var usersInConvo
        return new Promise ( function(resolve, reject) {
            database.checkUserIsInConversation(userID, conversation).then( (res) => 
                {
                    usersInConvo = res[0].users
                    database.newMessage(userID, conversation, msg).then( (res) => 
                    {
                         var sessions = accounts.getSessions()
                         var conversationSessions = []

                         searchUsers(usersInConvo)
                         resolve(conversationSessions)

                         function searchUsers(users){
                            for (let i = 0; i < users.length ; i++){
                                compareSessions(users[i])
                            }
                         }

                         function compareSessions(id){
                            for (let i = 0; i < sessions.length; i++ ){
                                if (sessions[i].userID == id){ 
                                    conversationSessions.push(sessions[i].socket.toString())
                                }
                            }
                         }

                         
                    })
                })
                .catch( (res) => 
                {
                    console.log(res)
                    reject (false)
                })
        }
    )}

}