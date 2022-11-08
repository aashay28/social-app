const User = require("../models/users");

const { response } = require("express");

const Post = require("../models/posts");

const path = require("path");

const fs = require("fs");

const { dirname, join } = require("path");

const io = require("../socket");

const Like = require("../models/likes");

const Message = require("../models/message");

// const session = require('express-session');

const { default: mongoose } = require("mongoose");

const xlsx = require("../util/excel");

const APIFeatures = require("../util/APIFeatures");

const catchAsync = require("../util/catchAsync").catchAsync;

const AppError = require("../util/appError");

exports.displayExistRecordXlsx = catchAsync(async(req, res, next) => {
    //   get data from Excel file store in server
    const userInfo = xlsx.getExcelData("UserInfo.xlsx");
    console.log(userInfo);
})

exports.getUserXls = catchAsync(async(req, res, next) => {
    const user = await User.find().select("-__v -isOnline");
    let post = await Post.find().select("-__v ").populate("creator", "email name");
    let filterPost = [];
    for (let i = 0; i < post.length; i++) {
        filterPost.push({
            email: post[i].creator.email,
            name: post[i].creator.name,
            UserId: post[i].creator._id,
            PostId: post[i]._id,
            caption: post[i].caption,
            image: post[i].image,
            date: post[i].date,
            createdAt: post[i].createdAt,
            updatedAt: post[i].updatedAt
        });
    }

    const userInfo = xlsx.CreateExcelData("UserInfo.xlsx", ["UserInfo", "PostInfo"], [user, filterPost]);
    // res.status(200).json({
    //         data: userInfo
    //     })
    res.download(path.join(__dirname, "../data", "UserInfo.xlsx"));
})


exports.getAggregation = catchAsync(async(req, res, next) => {
    let allUserInfo = [];
    const user = await User.find().select("-createdAt -updatedAt");
    for (let u of user) {
        const message = await Message.findOne({
            users: {
                $all: [req.userId, u._id.toString()],
            },
        }, {}, { sort: { "createdAt": -1 } }).select("message createdAt updatedAt -_id");

        if (message) {
            allUserInfo.push({...u._doc, message: message.message, createdAt: message.createdAt });
        } else {
            allUserInfo.push({...u._doc, createdAt: "2022-05-13T07:32:17.216+00:00" });
        }
    }
    sortByDate(allUserInfo);
    allUserInfo.reverse();
    res.status(200).json({ message: "success", results: allUserInfo.length, data: allUserInfo });
})

exports.demo = catchAsync(async(req, res, next) => {
    // let query = JSON.stringify(req.query);
    // let users;
    // let allUserInfo = [];
    // // 2. advanced filter
    // query = query.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // query = User.find(JSON.parse(query));
    // // User.find({ "authors": { "$regex": "Alex", "$options": "i" } })

    // if (req.query.fields) {
    //     let sortInMulti = req.query.fields.split(",").join(" ");
    //     console.log(sortInMulti);
    //     query = query.find().select(sortInMulti);
    // }

    // if (req.query.isOnline) {
    //     query = query.find({ isOnline: true });
    // }

    // if (req.query.sort) {
    //     let sortIn = req.query.sort.split(",").join(" ");
    //     console.log(sortIn);
    //     query = query.find().sort(sortIn);
    // }

    // users = await query.select("-password -createdAt -updatedAt");

    // if (req.query.lastMessage) {
    //     users = await User.lastMessage(req.userId, users);
    // }

    // if (!users) {
    //     return res.status(404).json({ message: "No users Found" });
    // }
    // return res.status(200).json({ message: "Users Details", results: users.length, data: users });


    // try {

    //     const filteredUser = new APIFeatures(User.find(), req.query)
    //         .filter()
    //         .sort()
    //         .limitFields()
    //         .lastMessage(req.userId);
    //     let users;
    //     // console.log(filteredUser.query);
    //     // filteredUser.query.then(res => {
    //     //     console.log("hola hola");
    //     //     console.log(res);
    //     // })
    //     users = await filteredUser.query;

    //     if (!users) {
    //         return res.status(404).json({ message: "No users Found" });
    //     }
    //     return res.status(200).json({ message: "Users Details", results: users.length, data: users });
    // } catch (err) {
    //     next(err);
    // }
})

exports.getPosts = catchAsync(async(req, res, next) => {
    // const demo = await Post.find();
    // console.log(demo);

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=2&limit=10  1-10 page1   11-20 page 2     21-30 page3
    let isLike = false;
    let query = Post.find()
        .populate("creator", "name image")
        .sort("-createdAt")
        .skip(skip).limit(limit);
    // console.log(req.originalUrl);
    if (req.originalUrl == "/api/getUserPost") {
        query = query.find({ creator: req.userId })
            .populate("creator", "name image")
            .sort("-createdAt")
            .skip(skip).limit(limit);;
    }
    const posts = await query;

    if (req.query.page) {
        const numOfPost = await Post.countDocuments();
        if (skip >= numOfPost) {
            return res.status(404).json({
                status: "fail",
                message: "Page Not Found",
                data: null
            })
        }
    }
    const combinedPost = [];
    for (let p of posts) {
        let sPost = {};
        isLike = false;

        const checkExistLike = await Like.findOne({ userId: req.userId, postId: p._id });
        if (checkExistLike) {
            isLike = true;
        }
        const totalLike = await Like.find({ postId: p._id }).countDocuments();
        sPost = {...p._doc, isLike, postTime: p.postTime, totalLike: totalLike };
        combinedPost.push(sPost);
    }

    // await User.updateOne({ _id: req.userId }, {
    //     $set: {
    //         isOnline: true
    //     }
    // });
    // IOfunction("isOnline", "check", null);
    // console.log("get all userId");
    // console.log(io.getIO().userId);
    // if (!io.getIO().userId) {
    //     io.getIO().userId = req.userId;
    // }
    res.status(200).json({
        message: "Display all the posts",
        result: combinedPost.length,
        posts: combinedPost
    });
});

exports.createPost = catchAsync(async(req, res, next) => {
    // console.log(req.file);
    // console.log("/images/post/" + req.file.filename);
    const caption = req.body.caption;
    const imageUrl = "/images/post/" + req.file.filename;
    const post = new Post({
        image: imageUrl,
        caption: caption,
        creator: req.userId,
        date: new Date().getTime()
    });

    await post.save();
    const getPosts = await Post.findById(post._id).populate("creator", "name image");
    IOfunction("posts", "create", getPosts)
        // io.getIO().emit('posts', {
        //     action: 'create',
        //     post: getUserName
        // });
    res.status(201).json({
        message: "Post created successfully",
        post: post
    });
});

exports.getUser = catchAsync(async(req, res, next) => {
    // console.log(pid);
    const uid = req.userId;
    const user = await User.findById(uid)
        .select("-password");
    if (!user) {
        // res.status(404).json({ message: "did not find user records" });
        return next(new AppError("did not find user records", 404));
    }
    res.status(200).json({ message: "user fetched", data: user });
});

exports.updateProfile = catchAsync(async(req, res, next) => {
    const uid = req.userId;
    // const name = req.body.name;
    // const email = req.body.email;
    let image = req.body.image;
    if (req.file) {
        image = "/" + req.file.path;
    }

    if (!image) {
        // return res.status(422).json({ message: "File Not Found" });
        return next(new AppError("File Not Found", 422));
    }

    const user = await User.findById(uid)
        .select("-password")
    if (!user) {
        return next(new AppError("Post Not Found", 404));
        // return res.status(404).json({ message: "Post Not Found" });
    }
    if (user.image) {
        clearImage(user.image);
    }
    // user.name = name;
    // user.email = email;
    user.image = image;
    const result = await user.save();


    return res.status(200).json({
        message: "records updated succsessfully",
        post: result
    })
});

exports.deletePost = catchAsync(async(req, res, next) => {

    const pid = req.params.pid;
    const post = await Post.findById(pid)
    let result = "";
    if (!post) {
        return next(new AppError("Could not find a post", 404));
        // const error = new Error("Could not find a post");
        // error.statusCode = 404;
        // throw error;
    }
    const userCheck = await User.findOne({ _id: req.userId });
    if (userCheck.isAdmin) {
        result = await Post.findByIdAndRemove(pid);
    } else {
        if (post.creator.toString() != req.userId) {
            return res.status(403).json({ message: "authentication error" });
        }
        result = await Post.findByIdAndRemove(pid);
    }
    clearImage(post.image);
    await Like.deleteMany({ postId: pid });
    const getPosts = await Post.find().sort("-createdAt").populate("creator", "name image");
    IOfunction("posts", "delete", getPosts)
        // console.log(getPosts);

    return res.status(200).json({
        message: "succsessfully deleted",
        data: result,
        error: null
    })
});

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const filteredUser = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .search()
        .limitFields()
        .lastMessage(req.userId);
    let users;
    users = await filteredUser.query;

    if (!users) {
        return next(new AppError("No users Found", 404));
        // return res.status(404).json({ message: "No users Found" });
    }
    return res.status(200).json({ message: "Users Details", results: users.length, data: users });
});

exports.likeAPost = catchAsync(async(req, res, next) => {
    const pid = req.params.pid;
    const checkExistLike = await Like.findOne({ userId: req.userId, postId: pid });
    if (!checkExistLike) {
        const like = Like({
            userId: req.userId,
            postId: pid
        });
        const likeSave = await like.save();
    } else {
        const deleteLike = await Like.deleteOne({ userId: req.userId, postId: pid });
    }
    res.status(201).json({
        status: "success",
        message: "liked post",
        data: null
    });
});


const clearImage = filePath => {
    try {
        const defaultImg = filePath.split("/")[2];
        if (defaultImg == "avatar.jpeg") {
            return 0;
        }
        imgPath = path.join(__dirname, "../", filePath);
        fs.unlink(imgPath, err => {
            if (err) {
                return res.status(422).json({ message: "Failed to delete Image" });
            }
        });
    } catch (err) {
        next(err);
    }
}

const IOfunction = (methodsName, action, data) => {
    io.getIO().emit(methodsName, {
        action: action,
        data: data
    });
}

const sortByDate = arr => {
    const sorter = (a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    arr.sort(sorter);
};

module.exports.IOfunction = IOfunction