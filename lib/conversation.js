var Database = require('./database')
var database = new Database

module.exports  = class Conversation {
    constructor(){}

    create(userIDs){
        database.createConversation(userIDs)
    }


    sendMessage(userID, conversation, msg){
        database.checkUserIsInConversation(userID, conversation)
            .then( (res) => 
            {
                console.log('res')
                database.newMessage(userID, conversation, msg)
            })
            .catch( (res) => 
            {
                console.log(res)
                return res
            })
    }

}