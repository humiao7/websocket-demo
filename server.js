const app = require('express')(); // 创建 express 实例

// 启用 http、socket.io 服务
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 定义路由
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

const onlinePerson = []; // 当前在线用户

io.on('connection', function (socket) {
    console.log('新用户加入，当前在线人数：' + (onlinePerson.length + 1))
    // 监听 join 事件
    socket.on("join", function (name) {
        onlinePerson.push({ id: socket.id, name: name });
        io.emit("join", { name: name, onlinePerson: onlinePerson }) //服务器通过广播将新用户发送给全体群聊成员
    })

    // 监听用户发送的消息
    socket.on("message", function (msg) {
        io.emit("message", msg) //将新消息广播出去
    })

    // 监听用户断开事件
    socket.on('disconnect', function () {
        for (let i = 0; i < onlinePerson.length; i++) {
            if (onlinePerson[i].id === socket.id) {
                let name = onlinePerson[i].name;
                onlinePerson.splice(i, 1);
                io.emit("exit", { name, onlinePerson: onlinePerson }) //服务器通过广播将新用户发送给全体群聊成员
                break;
            }
        }
        console.log('新用户离开，当前在线人数：' + onlinePerson.length);
    })
});


// 监听 3000 端口请求
http.listen(3000, function () {
    console.log('服务已启动：http://localhost:3000');
})