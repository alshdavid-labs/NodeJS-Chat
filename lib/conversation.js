module.exports  = class Conversation {
    constructor(id, users){
        this.conversation = []
        this.index = 0
        this.id = id
        this.users = users
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