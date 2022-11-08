const Message = require("../models/message");

const DeleteMessage = require("../models/deleteMessage");

const { default: mongoose } = require("mongoose");

const io = require("../socket");

const User = require("../models/users");

const catchAsync = require("../util/catchAsync").catchAsync;

exports.sendMessage = async(msg) => {
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
        io.getIO().broadcast.to(msg.room).emit("receiveMessage", msg);
    }
}

exports.disconnectUser = async(socketId) => {
    console.log("disconnected");
    console.log(socketId);
    await User.updateOne({ _id: socketId }, {
        $set: {
            isOnline: false
        }
    });

    //when some user login when side bar refresh
    io.getIO().emit("isOnline", {
        action: "check",
        data: null
    });
}

exports.addMessage = catchAsync(async(req, res, next) => {
    const { senderid, receiverid, message, messageId } = req.body;
    const demo = new mongoose.Types.ObjectId(messageId);
    const data = await Message.create({
        _id: new mongoose.Types.ObjectId(messageId),
        message: { text: message },
        users: [senderid, receiverid],
        sender: senderid
    });
    room = [senderid, receiverid].sort().toString().replace(",", "_");
    io.getIO().broadcast.to(room).emit("sendMessage", {
        messageId: cid
    });
    if (data) {
        return res.status(202).json({
            message: "Send Messsage",
            status: "success"
        })
    }
    return res.status(404).json({
        message: "message not send",
        status: "fail"
    })

});

exports.getAllMessage = catchAsync(async(req, res, next) => {
    const { senderid, receiverid } = req.body;
    let messages = null;
    let delMessage = await DeleteMessage.findOne({
        senderid: senderid,
        receiverid: receiverid
    });
    if (delMessage) {
        messages = await Message.find({
            users: {
                $all: [senderid, receiverid],
            },
            createdAt: {
                $gt: delMessage.lastMessageDate
            }
        }).sort({ createdAt: 1 });
    } else {
        messages = await Message.find({
            users: {
                $all: [senderid, receiverid],
            }
        }).sort({ createdAt: 1 });
    }
    const projectedMessages = messages.map((msg) => {
        return {
            fromSelf: msg.senderid.toString() === senderid,
            messageId: msg._id,
            message: msg.message,
            time: msg.createdAt
        };
    });
    res.status(200).json(projectedMessages);
});

exports.deleteChat = catchAsync(async(req, res, next) => {
    const { senderid, receiverid } = req.body;
    console.log(req.body);
    const existLastMessage = await DeleteMessage.findOne({
        senderid: senderid,
        receiverid: receiverid
    });
    if (existLastMessage) {
        existLastMessage.lastMessageDate = new Date().getTime();
        await existLastMessage.save();
    } else {
        await DeleteMessage.create({
            senderid: senderid,
            receiverid: receiverid
        });
    }
    return res.status(200).json({
        status: "success",
        message: "delete Chat successfully"
    });
});


exports.deleteSingleMessage = catchAsync(async(req, res, next) => {
    const cid = req.params.cid;
    console.log(cid);
    const existChat = await Message.findOne({
        _id: cid,
        senderid: req.userId
    })
    if (!existChat) {
        return res.status(403).json({
            status: "fail",
            message: "authentication issue"
        })
    }
    const delMessage = await Message.findByIdAndDelete(cid);
    // const delMessage = await Message.findByIdAndUpdate(cid, {
    //     message: "This Message was Deleted."
    // });
    room = delMessage.users.sort().toString().replace(",", "_");
    console.log("Deleted Messasge");
    // console.log(delMessage._id);
    console.log(cid);

    io.getIO().in(room).emit("deletedMessage", {
        messageId: cid
    });
    if (delMessage) {
        res.status(200).json({
            status: "success",
            message: "Chat Deleted"
        });
    }
});