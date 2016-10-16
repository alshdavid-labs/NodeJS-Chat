$('html').click(function(){
    $('#slidemenu').removeClass('open')
    $('#registerOverlay').removeClass('open')
    $('#loginOverlay').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#slidemenu').click( function(event){
    event.stopPropagation();
})

$('#slidemenu').on('click', 'li', function(event){
    event.stopPropagation();
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#conversationDraw').on('click', 'h1', function(event){
    $('#conversationDraw').toggleClass('open')
})

$('#conversationDraw').on('click', 'li', function(event){
    event.stopPropagation();
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#header').on('click', 'i', function(event){
    event.stopPropagation();
    $('#slidemenu').addClass('open')
})

$('#registerOverlay').on('click', '.panel', function(event){
    event.stopPropagation();
})

$('#loginOverlay').on('click', '.panel', function(event){
    event.stopPropagation();
})

$('.loggedout').on('click', function(event){
    event.stopPropagation();
    $('#loginOverlay').addClass('open')
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
})

$('#loginOverlay').on('click', '.registerButton', function(event){
    $('#loginOverlay').removeClass('open')
    $('#registerOverlay').addClass('open')
})

$('#conversation-list').on('click', 'li', function(){
    $('#convoinput').val( $(this).attr('var') )
    openConvo( $(this).attr('var') )
})

$('#user-list').on('click', 'li', function(){
    $('#slidemenu').removeClass('open')
    $('#conversationDraw').removeClass('open')
    chatTo( $(this).html() )
})

$('#loginButton').on('click', function(event){
    event.stopPropagation();
    var checks = 0
    if ($('#loginOverlay .email').val().length > 4){ checks = checks + 1 } else {
        $('#loginOverlay .email').css("border", "1px red solid")
    }

    if (checks == 1){
        globalUsername = $('#loginOverlay .email').val()
        login()
        $('#loginOverlay').removeClass('open')
    }
})

$('#registerButton').on('click', function(event){
    event.stopPropagation();
    var checks = 0
    var email = $('#registerOverlay .email').val()
    var username = $('#registerOverlay .username').val()
    $('#loginOverlay .email').val(email)
    
    if (email.length > 4){ checks = checks + 1 } else {
        $('#registerOverlay .email').css("border", "1px red solid")
    }
    if (username.length > 4){ checks = checks + 1 }  else {
        $('#registerOverlay .username').css("border", "1px red solid")
    }

    if (checks == 2){
        $('#registerOverlay').removeClass('open')
        globalUsername = username
        registerUser(email, globalUsername)
    }
})


$(document).keypress(function(e) {
    if(e.which == 13) {
        if (loggedInState == true){
            sendMessage()
            $('#m').val('');
            return false;
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