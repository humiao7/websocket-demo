var WebSocket = require('ws').Server;

// 启动一个 webSocket 服务
var wss = new WebSocket({ port: 8080 });

// 监听连接事件
wss.on('connection', function (ws) {
    sendBroadcast('XXX 进入聊天室,当前在线人数：' + wss.clients.size);
    // 监听客户端消息
    ws.on('message', function (message) {
        sendBroadcast(message);
    });
    // 客户端断开
    ws.onclose = function () {
        sendBroadcast('XXX 离开聊天室，当前在线人数：' + wss.clients.size);
    };
});

// 广播消息
function sendBroadcast(message) {
    wss.clients.forEach(function (client) {
        client.send(message);
    });
}

console.log('ws://localhost:8080 服务已启动...')