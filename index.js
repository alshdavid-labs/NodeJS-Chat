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
    console.log('nu:       ' + socket.id)
    //on new connection ask for auth
    io.to(socket.id).emit( "auth", { action : "login" });

    //AUTH ---------
    //on a recieved auth message
    socket.on('auth', function(msg){
        accounts.loginUser(msg.username, socket.id).then( (res) => 
        {
            //console.log(res)
            io.to(socket.id).emit( "auth", { action : 'success', user : res } )  
        
        }) .catch ( (res) => 
        {
            io.to(socket.id).emit( "auth", { action : 'faliure', message : res.toString() } )
        
        })
    })

    //MESSAGE -------
    socket.on('msg', function(msg){
        //console.log(msg)
        conversation.newMessage(msg.fromUser, msg.toConvo, msg.message).then( (res) => {
            //look through list of active socket sessions and send the message back out to them
            for (let i = 0; i < res.length ; i++){
                io.to(res[i]).emit( "msg", 
                    { 
                        action : 'new', 
                        fromUser : msg.fromUser, 
                        toConvo: msg.toConvo,  
                        message : msg.message 
                    }
                )
            }
        }).catch(()=>{})
    })


    //CHAT -------
    socket.on('convo', function(msg){
        //console.log(msg)
        conversation.create(socket.id, msg.fromUser, msg.toUsers).then((res)=>{
            io.to(socket.id).emit( "convo", { action : "new", conversation : res } )
        }).catch((res)=>{
            io.to(socket.id).emit( "error", { reason : res } )
        })
    })

    //Session Killer ----
    socket.on('disconnect', function () {
        console.log('ded:      ' + socket.id)
        accounts.removeSession(socket.id);
    });
 
});


//conversation.sendMessage()

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





