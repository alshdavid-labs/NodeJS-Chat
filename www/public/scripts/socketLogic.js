var socket = io("localhost:3000/");

//SOCKETS ============================
      socket.on( "auth"  , function(msg){ //---------- Login
        switch (msg.action) { 

            case 'success':
              console.log('logged in')
              auth = msg.user.account
              conversations = msg.user.conversations
              users = msg.user.users

              populateUserList()
              populateConvoList()
              renderConvo(conversations[0].messages)

              currentConversation = conversations[0]._id
              

              console.log(auth)
              console.log(conversations)
              console.log(users)

              break;  
            
            case 'failure':
              console.log('bad credentials')
              break;
        }
      })
          
      socket.on('msg', function(msg){ //----------On new message
          var list = $('#messages')
          if (msg.fromUser == auth._id){
            list.append('<li class="me" var="' + msg.fromUser + '">' + msg.message + '</li>')
          } else {
            list.append('<li class="" var="' + msg.fromUser + '">' + msg.message + '</li>')
          }

          addMessageToConversationData(msg.message, msg.toConvo, msg.fromUser)
          chatArea.scrollTop = chatArea.scrollHeight;
      });

      socket.on('convo', function(msg){ // ------------------on new convo
        login()
      })

      socket.on('error', function(msg){ // ------------------on error
        console.log(msg)
      })

      function sendMessage(){  //--- Send Message
        var letter = {
            fromUser : auth._id,
            toConvo : currentConversation,
            message : $('#m').val()
        }       
        socket.emit('msg', letter);
        $('#m').val('');
      }

      function socketCreateConvo(fromID, toIDs){  //--- Create Convo
        var letter = {
            fromUser : fromID,
            toUsers : toIDs
        }       
        socket.emit('convo', letter);
      }