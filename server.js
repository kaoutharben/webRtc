
var http = require('http');


var express = require('express');
var app = express();

app.use (express.static ('public'));
app.get('/', function (request, response) {
    
    response.sendFile(__dirname + '/index.html');
});


var server = http.createServer(app);


var io = require('socket.io')(server);

io.sockets.on('connection', function (socket){
    
socket.on('message', function (message) {
log('S --> Got message: ', message);
socket.broadcast.to(message.channel).emit('message', 
message.message);
});
socket.on('create or join', function (channel) {
    var numClients = channel.length;

console.log('numclients = ' + numClients);
if (numClients == 0){
socket.join(channel);
socket.emit('created', channel);
} else if (numClients == 1) {
io.sockets.in(channel).emit('remotePeerJoining', channel);
socket.join(channel);
socket.broadcast.to(channel).emit('broadcast: joined', 'S --> broadcast(): client ' + socket.id + ' joined channel ' + channel);
} else { console.log("Channel full!");
socket.emit('full', channel);
}
});
socket.on('response', function (response) {
log('S --> Got response: ', response);
socket.broadcast.to(response.channel).emit('response',
response.message);
});
socket.on('Bye', function(channel){
    console.log("bye");
socket.broadcast.to(channel).emit('Bye');
socket.disconnect(true);
});
socket.on('Ack', function () {
console.log('Got an Ack!');
socket.disconnect(true);
});
function log(){
var array = [">>> "];
for (var i = 0; i < arguments.length; i++) {
array.push(arguments[i]);
}
socket.emit('log', array);
}
});

server.listen(8181, console.log("Listening to port 8181"));