const app = require("./app");

const server = require('http').Server(app);

const io = require("./socket").init(server);

const messageController = require("./controller/message");

const res = require("express/lib/response");

const { default: mongoose } = require("mongoose");

const Message = require("./models/message");

const User = require("./models/users");

require("./config/db");


io.on("connection", socket => {
    console.log("Client Connected");
    socket.on("isOnline", async(userId) => {
        console.log("Online");
        // console.log("//////");
        // console.log(userId);
        console.log(socket.userId + " " + userId);
        if (!socket.userId) {
            socket.userId = userId;
            socket.join(socket.userId);
            await User.updateOne({ _id: socket.userId }, {
                $set: {
                    isOnline: true
                }
            });
            io.emit("isOnline", {
                action: "check",
                data: null
            });
        }
        console.log(socket.userId);

    });

    socket.on('joinChat', (room) => {
        socket.join(room);
        socket.room = room;
        console.log("joinChat");
        console.log(room);
    });

    socket.on("sendMessage", async(msg) => {
        // messageController.sendMessage(msg);
        console.log(msg);
        console.log("sendMessage");
        console.log(msg.room);
        const msgSave = await Message.create({
            _id: new mongoose.Types.ObjectId(msg.messageId),
            message: msg.message,
            users: [msg.senderid, msg.receiverid],
            senderid: msg.senderid
        });
        if (msgSave) {
            socket.to(msg.receiverid).emit("receiveChatMessage", null);
            socket.broadcast.to(msg.room).emit("receiveMessage", msg);
        }
    });

    socket.on('leaveChat', () => {
        console.log("leave Chat");
        console.log(socket.room);
        socket.leave(socket.room);
    });

    socket.on('disconnect', async() => {
        // messageController.disconnectUser(socket.userId);
        console.log("disconnected");
        console.log(socket.userId);
        socket.leave(socket.userId);
        await User.updateOne({ _id: socket.userId }, {
            $set: {
                isOnline: false
            }
        });
        // IOfunction("isOnline", "check", null);
        io.emit("isOnline", {
            action: "check",
            data: null
        });
    });
});



server.listen(process.env.PORT, () => {
    console.log("Server response ready to use " + process.env.PORT);
});

module.exports.io = io;