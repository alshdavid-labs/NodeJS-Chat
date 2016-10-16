var socket = io("sandbox.davidalsh.com:3000/");
//var socket = io("localhost:3000/");


//SOCKETS ============================
socket.on( "auth"  , function(msg){ //---------- Login
    switch (msg.action) { 

        case 'success':
            console.log('logged in')
            pageInit()
            auth = msg.user.account
            conversations = msg.user.conversations
            users = msg.user.users

            populateUserList()
            populateConvoList()
            if (conversations.length > 0){
                renderConvo(conversations[0].messages, conversations[0].name)
                currentConversation = conversations[0]._id
            } else {
                $('#header h1').html("No Convos") 
            }
            removeLogin()
            loggedInState = true
            
            console.log(auth)
            console.log(conversations)
            console.log(users)

            console.log("current: " + currentConversation)

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

socket.on('refresh', function(msg){ // ------------------on refresh signal
    console.log('refresh')
    if (loggedInState == true) {
        login()
    }
})

socket.on('error', function(msg){ // ------------------on error
    console.log(msg)
})

socket.on('disconnect', function(){
    showLogin()
    loggedInState = false
})

function sendMessage(){  //--- Send Message
    var letter = {
        fromUser : auth._id,
        toConvo : currentConversation,
        message : $('#m').val()
    }       
    if ($('#m').val().length > 0){
        console.log(letter)
        socket.emit('msg', letter);
        $('#m').val('');
    } else {
        console.log('Enter Something')
    }    
}

function socketCreateConvo(fromID, toIDs){  //--- Create Convo
    var data = {
        fromUser : fromID,
        toUsers : toIDs
    }       
    socket.emit('convo', data);
}

function registerUser(email, username){
    var data ={
        'email' : email,
        'username' : username
    }
    console.log(data)
    socket.emit('reg', data);
}

function login(){
    socket.disconnect();
    socket.connect()

    email = globalUsername
    //console.log(globalUsername)
    socket.emit( "auth", { 'email' : email} ) // Move to sockets
    pageInit()
}

function logout(){
    socket.disconnect();
    pageInit()
}