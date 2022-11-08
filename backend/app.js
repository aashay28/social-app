const dotenv = require("dotenv")

dotenv.config({ path: "./.env" });

const express = require("express")

const fs = require("fs");

const app = express();

const path = require("path");

const apiRouter = require("./routers/api");

const msgRouter = require("./routers/message");

const bodyParser = require("body-parser");

// const session = require("express-session");

const { default: mongoose } = require("mongoose");

// const helmet = require("helmet");

// const mongoDbStore = require("connect-mongodb-session")(session);

const cors = require('cors');

const cookieParser = require('cookie-parser');

// const store = mongoDbStore({
//     uri: process.env.DATABASE_CONNECTION_STRING,
//     collection: "sessions"
// });

const multer = require("multer");
const { Socket } = require("socket.io");
const compression = require("compression");
const morgan = require("morgan");

const rateLimit = require('express-rate-limit');

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(cors({ credentials: true })); // cross platform run independence

// app.use(helmet()); // that send various http headers to help protect app

app.use(compression()) // compress file size in request

// app.use(morgan("tiny", { stream: accessLogStream })); // logged request
// app.use(morgan("tiny")); // logged request

// app.use(morgan("combined", { stream: accessLogStream })); // logged request

app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, '/images')));

app.use("/images/post", express.static(path.join(__dirname, '/images/post')));

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour per request
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// app.use(bodyParser.urlencoded({ extended: true })); //this for  x-www-form-urlencode <form>

// app.use(bodyParser.json()); // this for json   applcation/json

app.use(express.json());


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//     next();
// });

// app.use(cookieParser());

// app.use(session({
//     secret: "session",
//     resave: false,
//     saveUninitialized: false,
//     // store: store,
//     cookie: {
//         // Session expires after 1 min of inactivity.
//         expires: 1000 * 60 * 60,
//         sameSite: true
//     }
// }));

// app.use((req, res, next) => {
//     if (req.session.isOnline == true) {
//         req.session.cookie.expires = new Date(Date.now() + 20000);
//     } else {
//         req.session.isOnline = false;
//     }
//     next();
// });

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
    // return res.status(404).json({
    //     status: "fail",
    //     message: `can't find ${req.originalUrl} on this server!`
    // })
    const err = new Error(`can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    err.status = "error";
    next(err);
});

app.use((error, req, res, next) => {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    error.message = error.message;
    error.status = error.status || "error";

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
});

module.exports = app;