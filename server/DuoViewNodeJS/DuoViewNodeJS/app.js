var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var scripts = ['/js/duoview1.js', '/js/ServerConnection.js']
var files = ['/big_buck_bunny.mp4']

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

files.forEach(function (item, index, array) {
    app.get(item, function (req, res) {
        res.sendFile(__dirname + '/Client' + item);
    });
});



function setmaster(client) {
    master = client.id;
    socket.broadcast("notifyUser", connectedClients[master] + " was assigned master");
    console.log(connectedClients[master] + " is now master!");
}

io.on('connection', function (socket) {
    connectedClients[socket.id] = "User " + socket.id;
    var name = connectedClients[socket.id];
    socket.emit('name', connectedClients[socket.id]);

    console.log(socket.id + ' connected');
    console.log(connectedClients[socket.id]);
    socket.on('pause', (time) => {
        console.log(name + ": Paused, Time: " + time);
        socket.broadcast.emit('pause', name, time);
    });

    socket.on('play', () => {
        console.log(name + ": Played");

        socket.broadcast.emit('play', name);
    });

    socket.on('seeked', (data) => {
        console.log(name + ": seeked to " + data);

        socket.broadcast.emit('seeked', name, data);
    });

    socket.on('select', (source) => {
        console.log(name + " selected: " + source);

        socket.broadcast.emit('select', name, source);
    });

    

    socket.on('sync_request', () => {
        if (master != 0) {
            if (socket.id == master) {
                connectedClients.forEach(function (item, index) {
                    socket.to(item).emit('forceSync');
                });
                socket.broadcast.emit('notifyUser', "Forcing everyone to sync with master");
            }
            else {
                try {
                    socket.to(master).emit('syncRequest', name, "Forcing everyone to sync with master");
                }
                catch (err) {
                    socket.to(socket).emit('nosync', name, "Master has disconnected");
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

    socket.on('changeName', (data) => {
        console.log(data);
    });

    socket.on('chat', function (data) {
        console.log(name + ":" + data);

        socket.broadcast.emit('chat', name, data);
    });


});



http.listen(80, function () {
    console.log('listening on *:80');
});