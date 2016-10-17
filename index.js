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
    socket.on('auth', function(msg){
        if(msg.email){
        accounts.loginUser(msg.email, socket.id).then( (res) => {
            io.to(socket.id).emit( "auth", { action : 'success', user : res } )  
        }).catch ( (res) => {
            io.to(socket.id).emit( "auth", { action : 'failure', message : res.toString() } )
        })
        } else {
            console.log("BOUNCED:  auth")
        }
    })

    //REGISTER ---------
    socket.on('reg', function(msg){
        if(msg.email && msg.username){
            accounts.createUser(msg.email, msg.username, socket.id).then( (res) => 
            {
                io.to(socket.id).emit( "reg", { action : 'success', user : res } )
                //tell front end to refresh -- for now 
                io.emit('refresh');  
            }).catch ( (res) => {
                io.to(socket.id).emit( "reg", { action : 'faliure', message : res.toString() } )
            })
        } else {
            console.log("BOUNCED:  registration")
        }
    })

    //MESSAGE -------
    socket.on('msg', function(msg){
        if(msg.fromUser && msg.toConvo && msg.message){
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
        } else {
            console.log("BOUNCED:  message")
        }
    })

    //CONVERSTION -------
    socket.on('convo', function(msg){
        if(msg.fromUser && msg.toUsers && (msg.toUsers.length > 0)){
            conversation.create(socket.id, msg.fromUser, msg.toUsers).then((res)=>{
                io.to(socket.id).emit( "convo", { action : "new", conversation : res } )
                //tell front end to refresh -- for now 
                io.emit('refresh'); 
            }).catch((res)=>{
                io.to(socket.id).emit( "convo", { action : "failure", conversation : res } )
            })
        } else {
            console.log("BOUNCED:  convo")
        }
    })

    //REFRESH ---------
    socket.on('authrefresh', function(msg){
        if(msg.email){
        accounts.loginUser(msg.email, socket.id).then( (res) => {
            io.to(socket.id).emit( "authrefresh", { action : 'success', user : res } )  
        }).catch ( (res) => {
            io.to(socket.id).emit( "authrefresh", { action : 'failure', message : res.toString() } )
        })
        } else {
            console.log("BOUNCED:  auth")
        }
    })

    //Session Killer ----
    socket.on('disconnect', function () {
        console.log('ded:      ' + socket.id)
        accounts.removeSession(socket.id);
    });
 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//accounts.createUser('alshD2', 'alsh2')

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



