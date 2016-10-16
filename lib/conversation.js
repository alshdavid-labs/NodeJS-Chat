var Database = require('./database')
var Accounts = require('./accounts')
var accounts = new Accounts
var database = new Database

module.exports  = class Conversation {
    constructor(){}

    create(userIDs){
        database.createConversation(userIDs)
    }


    newMessage(userID, conversation, msg){
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