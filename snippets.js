var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messages = ['asda', 'okdsji']

//express serving the file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});




io.on('connection', function(socket){ 
    emitAll();
      
    socket.on('chat message', function(msg){
        messages.push(msg)
        console.log(messages) 
        io.emit('chat message', msg);
    });
});

emitAll()

function emitAll(){
    for ( i = 0 ; i < messages.length ; i++){
        io.emit('message', messages[i])
    }
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});
