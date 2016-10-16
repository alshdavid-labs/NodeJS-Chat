    
      var chatArea = document.getElementById('message-list')
      var auth = null
      var conversations = null
      var users = null
      var currentConversation = null

      var username = "jack"  

      function pageInit(){
        $('#logininput').val(username)
        $('#conversation-list').html('<li><b>Conversations</b></li> ')
        $('#user-list').html('<li><b>Users</b></li> ')
        $('#messages').html('')
        auth = null
        conversations = null
        users = null
      }
      pageInit()


      //LOGIC\/\/\/\/\/

      //UI & Navigation ===================
      function login(){
        socket.disconnect();
        socket.connect()
        username = $('#logininput').val()
        socket.emit( "auth", { 'email' : username} ) // Move to sockets
        pageInit()
      }

      function logout(){
        socket.disconnect();
        pageInit()
      }


      function clearValues(){
          $('#chattoinput').val('')
          $('#convoinput').val('')
      }

      $('#user-list').on('click', 'li', function(){
        clearValues()
        $('#chattoinput').val( $(this).html() )
      })

      $('#conversation-list').on('click', 'li', function(){
        clearValues()
        $('#convoinput').val( $(this).attr('var') )
        openConvo()
      })

      function populateUserList(){
        var list = $('#user-list')
        for ( i = 0; i < users.length ; i++ ) {
          list.append('<li var="' + users[i]._id + '">' + users[i].username + '</li>')
        } 
      }

      function openConvo(){
          currentConversation = $('#convoinput').val()
          for (let i = 0; i < conversations.length; i++){
              if (conversations[i]._id == currentConversation){
                renderConvo(conversations[i].messages)
                return
              }
          }
      }

      function chatTo(){
        var chatToStart = $('#chattoinput').val()
        var id = getIdFromName(chatToStart)
        startNewChat(id)
      }
      
      // UI Controllers ==========================

      function renderConvo(messages){
        var list = $('#messages')
        list.html('')
        for (let i = 0; i < messages.length; i++){          
          if (messages[i].userID == auth._id){
            list.append('<li class="me">' + messages[i].message + '</li>')
          } else {
            list.append('<li>' + messages[i].message + '</li>')
          }
          chatArea.scrollTop = chatArea.scrollHeight;
        }
        
      }

      function startNewChat(id){
        socketCreateConvo(auth._id, [id])
      }

      //LOGIC =============================

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




      /// UGGHH gotta clean this ---------
      // this determines who the conversation is with then appends it to the available conversations

      function populateConvoList(){
        var list = $('#conversation-list')
       for (let i = 0; i < conversations.length ; i++ ) {
          var convoSubject = subject(conversations[i].users)
          list.append('<li var="' + conversations[i]._id + '">' + convoSubject + '</li>')
        } 
      }

      function subject(userlist){
        for (let i2 = 0 ; i2 < userlist.length ; i2++){
            if ( userlist[i2] != auth._id ){
              return whois(userlist[i2])
            }
          }
      }

      function whois(id){
        for (let i3 = 0; i3 < users.length ; i3++ ) {
          if (users[i3]._id == id) {
            return users[i3].username
          } 
        }
      }

      
