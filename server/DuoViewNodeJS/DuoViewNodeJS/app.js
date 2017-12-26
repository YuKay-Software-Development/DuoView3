
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function heartbeat() {
    this.isAlive = true;
}


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on("close", function (code, reason) {
        console.log("Connection closed")
    });

    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.send('something');


});



const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 30000);