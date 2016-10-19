var co = require('co');
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
        if(!msg.email){ console.log("BOUNCED:  auth input"); return }
        
        co(function *() {
            try 
            {
                var sessionData = yield accounts.loginUser(msg.email, socket.id)
                responder ( { 'action' : 'success', 'user' : sessionData } )
            } 
            catch(err) 
            {   
                responder( { 'action' : 'failure', 'message' : err } )
            }
        })

        //comunication portal
        function responder(message){
            io.to(socket.id).emit("auth", message)
        }
    })

    //REGISTER ---------
    socket.on('reg', function(msg){
        if(!msg.email || !msg.username){ console.log("BOUNCED:  registration input"); return }

        co(function *() {
            try
            {
                var response = yield accounts.createUser(msg.email, msg.username, socket.id)
                responder ( { action : 'success', user : res } )
                
                //for now use this to refresh all clients
                io.emit('refresh');  
            }
            catch (err)
            {
                responder ( { action : 'faliure', message : err } )
            }
        })

        //comunication portal
        function responder(message){
            io.to(socket.id).emit("reg", message)
        }
    })

    //MESSAGE -------
    socket.on('msg', function(msg){
        if(!msg.fromUser || !msg.toConvo || !msg.message){ console.log("BOUNCED:  message"); return }
        
        co(function *() {
            try 
            {
                var response = yield conversation.newMessage(msg.fromUser, msg.toConvo, msg.message)
                emitToArray(response)
            } 
            catch (err) 
            {

            }            
        })
            
        function emitToArray(sockets){
            for (let i = 0; i < sockets.length ; i++){
                var message = { action : 'new', fromUser : msg.fromUser, toConvo: msg.toConvo, message : msg.message }
                io.to(sockets[i]).emit( "msg", message)
            }
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





