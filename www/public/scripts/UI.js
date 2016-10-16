$('html').click(()=>{
    $('#slidemenu').removeClass('open')
    $('#registerOverlay').removeClass('open')
    $('#loginOverlay').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#slidemenu').click((event)=>{
    event.stopPropagation();
})

$('#slidemenu').on('click', 'li', (event)=>{
    event.stopPropagation();
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#conversationDraw').on('click', 'h1', (event)=>{
    $('#conversationDraw').toggleClass('open')
})

$('#conversationDraw').on('click', 'li', (event)=>{
    event.stopPropagation();
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#header').on('click', 'i', (event)=>{
    event.stopPropagation();
    $('#slidemenu').addClass('open')
})

$('#registerOverlay').on('click', '.panel', (event)=>{
    event.stopPropagation();
})

$('#loginOverlay').on('click', '.panel', (event)=>{
    event.stopPropagation();
})

$('.loggedout').on('click', (event)=>{
    event.stopPropagation();
    $('#loginOverlay').addClass('open')
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#loginOverlay').on('click', '.registerButton',(event)=>{
    $('#loginOverlay').removeClass('open')
    $('#registerOverlay').addClass('open')
})

$('#conversation-list').on('click', 'li', function(){
    $('#convoinput').val( $(this).attr('var') )
    openConvo()
})

$('#user-list').on('click', 'li', function(){
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
    chatTo( $(this).html() )
})

$('#loginButton').on('click', (event)=>{
    event.stopPropagation();
    globalUsername = $('#loginOverlay .email').val()
    console.log(globalUsername)
    login()
    $('#loginOverlay').removeClass('open')
})

$('#registerButton').on('click', (event)=>{
    event.stopPropagation();
    var email = $('#registerOverlay .email').val()
    var globalUsername = $('#registerOverlay .username').val()
    $('#loginOverlay .email').val(email)
    registerUser(email, globalUsername)
    $('#registerOverlay').removeClass('open')
})


$(document).keypress(function(e) {
    if(e.which == 13) {
        if (loggedInState == true){
            sendMessage()
        }
    }
});

function removeLogin(){
    $('.loggedout').css("display", "none")
}

function showLogin(){
    $('.loggedout').css("display", "block")
}


function renderConvo(messages, withWho){
    var list = $('#messages')
    list.html('')
    $('#header h1').html( withWho )
    for (let i = 0; i < messages.length; i++){          
        if (messages[i].userID == auth._id){
        list.append('<li class="me">' + messages[i].message + '</li>')
        } else {
        list.append('<li>' + messages[i].message + '</li>')
        }
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

function clearAll(){
    $('#conversation-list').html('')
    $('#user-list').html('')
}

function populateUserList(){
    var list = $('#user-list')
    for ( i = 0; i < users.length ; i++ ) {
        if (users[i]._id != auth._id) {
            list.append('<li var="' + users[i]._id + '">' + users[i].username + '</li>')
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
        conversations[i].name = convoSubject
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

//=================================