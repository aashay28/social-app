const jwt = require("jsonwebtoken");

const catchAsync = require("../util/catchAsync").catchAsync;

const AppError = require("../util/appError");

module.exports = catchAsync(async(req, res, next) => {
    // console.log(JSON.stringify(req.cookies));
    const isauthorized = req.get("Authorization");
    if (!isauthorized) {
        return next(new AppError("not authorized please Login", 401));
        // return res.status(401).json({ message: "not authorized please Login" });
    }
    const token = isauthorized.split(' ')[1];
    // console.log(token);
    let decodedToken;
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(">>>>>> Token Value >>>>>>");
    console.log(decodedToken);
    if (!decodedToken) {
        return next(new AppError("not authenticated", 401));
        // return res.status(401).json({ message: "not authenticated" })
    }
    req.userId = decodedToken.userId;
    next();
})