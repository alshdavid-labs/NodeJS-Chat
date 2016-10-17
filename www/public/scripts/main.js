    
      function pageInit(){
        $('#loginOverlay .email').val(globalUsername)
        $('#messages').html('')
        auth = null
        conversations = null
        users = null
        //console.log(globalUsername)
        clearAll()
      }
      pageInit()  

      function openConvo(updateTo){
          currentConversation = updateTo
          for (let i = 0; i < conversations.length; i++){
              if (conversations[i]._id == currentConversation){
                renderConvo(conversations[i].messages, conversations[i].name)
                return
              }
          }
          console.log("current: " + currentConversation)
      }

      function chatTo(userList){
        var id = getIdFromName(userList)        
        //console.log(id)
        socketCreateConvo(auth._id, [id])
        clearAll()
        login()
      }
      
      
      


      //TOOLS =============================

      function getIdFromName(name){
        for (let i=0; i<users.length;i++){
          if (users[i].username == name){
            return users[i]._id
          }
        }
        return false
      }

      function getNameFromId(id){
        for (let i=0; i<users.length;i++){
          if (users[i]._id == id){
            return users[i].username
          }
        }
        return false
      }



      // Data Service =============
      function addMessageToConversationData(message, convoID, userID){
        for (let i = 0; i < conversations.length; i++){
          if (conversations[i]._id == convoID){
            conversations[i].messages.push({'message' : message, 'userID' : userID}) 
          }
        }
      }







      

      
