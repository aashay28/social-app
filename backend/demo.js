Socket.on("new document",
    (newDocumentRecieved) => { var chat = newDocumentRecieved.chat; if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => { if (user._id == newDocumentRecieved.sender._id) return;
            console.log("Document received", newDocumentRecieved);
            socket.in(user._id).emit("Document received", newDocumentRecieved); }); });