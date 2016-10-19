//var socket = io("sandbox.davidalsh.com:3000/");
var socket = io("localhost:3000/");
var data = {}

data['init'] = function(msg) {
    ui.loader('close')
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
}

//SOCKETS ============================
socket.on( "auth"  , function(msg){ //---------- Login
    switch (msg.action) { 

        case 'success':
            data.init(msg)
            ui.notification("Logged in")
            console.log("====Login====") 
            console.log(auth)
            console.log(conversations)
            console.log(users)
            console.log("==============") 
            console.log("") 
            break;  
        
        case 'failure':
            ui.loader('close')
            ui.notification("Invalid User")
            console.log('bad credentials')
            break;
    }
})

socket.on( "authrefresh"  , function(msg){ //---------- Login
    switch (msg.action) { 

        case 'success':
            data.init(msg)
            //ui.notification("Logged in")
            console.log("====Refresh====") 
            console.log(auth)
            console.log(conversations)
            console.log(users)
            console.log("==============") 
            console.log("") 
            break;  
        
        case 'failure':
            ui.loader('close')
            ui.notification("Invalid User")
            console.log('bad credentials')
            break;
    }
})

socket.on('refresh', function(msg){ // ------------------on refresh signal
    authRefresh()
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
    switch (msg.action){
        case "success":
            ui.notification("Conversation Created")            
            break;
        
        case "failure":
            ui.notification("Conversation Already Exists")
            ui.loader('close')
            break;
    }
})



socket.on('error', function(msg){ // ------------------on error
    console.log(msg)
    ui.notification(msg)
})

socket.on('disconnect', function(){
    //showLogin()
    loggedInState = false
})

function sendMessage(){  //--- Send Message
    var letter = {
        fromUser : auth._id,
        toConvo : currentConversation,
        message : $('#m').val()
    }       
    if ($('#m').val().length > 0){
        console.log("==============") 
        console.log("Sending Msg") 
        console.log(letter)
        socket.emit('msg', letter);
        console.log("==============") 
        console.log("") 
        $('#m').val('');
    } else {
        console.log('Enter Something')
    }    
}

function socketCreateConvo(fromID, toIDs){  //--- Create Convo
    ui.loader('open')
    var data = {
        fromUser : fromID,
        toUsers : toIDs
    }   
    console.log("==============") 
    console.log("Creating Convo")    
    console.log(data)
    socket.emit('convo', data);
    console.log("==============") 
    console.log("") 
}

function registerUser(email, username){
    var data ={
        'email' : email,
        'username' : username
    }
    console.log("==============") 
    console.log("Reg Usr") 
    console.log(data)
    socket.emit('reg', data);
    console.log("==============") 
    console.log("") 
    ui.notification("User Registered")
}

function login(){
    socket.disconnect();
    socket.connect()
    email = globalUsername
    socket.emit( "auth", { 'email' : email} ) // Move to sockets
    pageInit()
}

function authRefresh(){
    socket.disconnect();
    socket.connect()
    email = globalUsername
    socket.emit( "authrefresh", { 'email' : email} ) // Move to sockets
    pageInit()
}

function loginLoud(){
    ui.loader('open')
    socket.disconnect();
    socket.connect()
    email = globalUsername
    socket.emit( "auth", { 'email' : email} ) // Move to sockets
    pageInit()
}

function logout(){
    socket.disconnect();
    pageInit()
}