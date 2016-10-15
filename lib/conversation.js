var Database = require('./database')
var database = new Database

module.exports  = class Conversation {
    constructor(){}

    create(userIDs){
        database.createConversation(userIDs)
    }


    addMessage(user, msg){
        for ( var i = 0 ; i < this.users.length; i++ )
        {
            if (this.users[i] == user)
            {
                var index = this.conversation.length
                var message = {
                    'message' : msg,
                    'user' : user,
                    'index' : index
                }
                this.conversation.push(message)
                return true
            }
        }
        return false
    }

    getMessages(){
        return this.conversation
    }
}