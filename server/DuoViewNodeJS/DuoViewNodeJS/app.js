var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var scripts = ['/js/duoview1.js', '/js/ServerConnection.js']

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/index.html');
});

scripts.forEach(function (item, index, array) {
    app.get(item, function (req, res) {
        res.sendFile(__dirname + '/Client' + item);
    });
});

io.on('connection', function (socket) {
    console.log('a user connected');
    //socket.broadcast()

    socket.on('hello', function (data) {
        console.log(data);
    });


});



http.listen(80, function () {
    console.log('listening on *:80');
});