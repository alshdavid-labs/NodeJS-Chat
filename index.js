//var Conversation = require('./conversation')
//var newConvo = new Conversation(1, ['john', 'steve'])
//newConvo.addMessage('steve', 'sdasdadsasd')
//console.log(newConvo.getMessages())
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Accounts = require('./lib/accounts')
var accounts = new Accounts

io.on('connection', function(socket){ 
    //on new connection ask for auth
    io.to(socket.id).emit( "auth", { action : "login" });

    //AUTH ---------
    //on a recieved auth message
    socket.on('auth', function(msg){
        var userID = accounts.getAccount(msg.username)

        if (userID) {
            var res = accounts.loginUser(userID, socket.id)

            //errors
            if (res) {
                io.to(socket.id).emit( "auth", { action : 'success' } )
            } else {
                io.to(socket.id).emit( "auth", { action : 'failure' } )
            }
        } else {
            io.to(socket.id).emit( "auth", { action : 'faliure' } )
        }
    })

    //MESSAGE -------
    socket.on('msg', function(msg){})
});

//accounts.dbTest().then( function(reason){} );





http.listen(3000, function(){
  console.log('listening on *:3000');
});





