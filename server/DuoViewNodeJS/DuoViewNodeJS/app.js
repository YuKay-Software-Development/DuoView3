var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var scripts = ['/js/duoview1.js', '/js/ServerConnection.js']

var master = 0;

var connectedClients = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/index.html');
});

scripts.forEach(function (item, index, array) {
    app.get(item, function (req, res) {
        res.sendFile(__dirname + '/Client' + item);
    });
});

io.on('connection', function (socket) {
    console.log(socket.id + 'connected');
    connectedClients[socket.id] = "User " + socket.id;
    var name = connectedClients[socket.id];

    console.log(connectedClients[socket.id]);
    socket.on('pause', (time) => {
        socket.broadcast.emit('pause', (name, time));
    });

    socket.on('play', () => {
        socket.broadcast.emit('play', name);
    });

    socket.on('seeked', (data) => {
        socket.broadcast.emit('seeked', (name, data));
    });

    socket.on('select', (video) => {
        socket.broadcast.emit('select', (name, video));
    });

    socket.on('sync_request', () => {
        if (master != 0) {
            if (socket.id == master.id) {
                connectedClients.forEach(function (item, index) {
                    socket.to(item).emit('forceSync');
                });
                socket.broadcast.emit('notifyUser', "Forcing everyone to sync with master");
            }
            else {
                try {
                    socket.to(master).emit('syncRequest', (name, "Forcing everyone to sync with master"));
                }
                catch (err) {
                    socket.to(socket).emit('nosync', (name, "Master has disconnected"));
                }
            }

        }
    });

    socket.on('sync', (name, data) => {
        console.log(data);
    });

    socket.on('make_master', (name, data) => {
        console.log(data);
    });

    socket.on('changeName', (name, data) => {
        console.log(data);
    });

    socket.on('chat', function (data) {
        console.log(data);
    });


});



http.listen(80, function () {
    console.log('listening on *:80');
});