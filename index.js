//var Conversation = require('./conversation')
//var newConvo = new Conversation(1, ['john', 'steve'])
//newConvo.addMessage('steve', 'sdasdadsasd')
//console.log(newConvo.getMessages())
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Conversation = require('./lib/conversation')
var Accounts = require('./lib/accounts')
var accounts = new Accounts
var conversation = new Conversation()

io.on('connection', function(socket){ 
    //on new connection ask for auth
    io.to(socket.id).emit( "auth", { action : "login" });

    //AUTH ---------
    //on a recieved auth message
    socket.on('auth', function(msg){
        accounts.loginUser(msg.username, socket.id).then( (res) => 
        {
            console.log(res)
            io.to(socket.id).emit( "auth", { action : 'success', messages : recentMessages } )  
        
        }) .catch ( (res) => 
        {
            io.to(socket.id).emit( "auth", { action : 'faliure', message : res.toString() } )
        
        })
    })

    //MESSAGE -------
    socket.on('msg', function(msg){})


    //CHAT -------
    socket.on('chat', function(msg){})
});

//accounts.dbTest().then( function(reason){} );

// accounts.loginUser("david", "dsad2324da").then(
//     (res) => {
//         console.log(res)
//     }
// )

//conversation.create([ "5801bfca42755d047e89e1a6", "5801bfca42755d047e89e1a8" ])
//conversation.create([ "5801bfca42755d047e89e1a6", "5801bfca42755d047e89e1a9" ])

//accounts.test()





http.listen(3000, function(){
  console.log('listening on *:3000');
});





