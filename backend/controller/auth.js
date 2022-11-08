const bcrypt = require('bcryptjs');

const User = require('../models/users');

const IOfunction = require('./api').IOfunction;

const catchAsync = require('../util/catchAsync').catchAsync;

const AppError = require('../util/appError');

const sendMail = require('../util/email');

const crypto = require('crypto');

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  if (!req.body.password && !req.body.confirmPassword) {
    return next(
      new AppError('Please Enter Password and Confirm Password'),
      401
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new AppError('Password and Confirm Password are not match!!'),
      401
    );
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token invalid or expired'), 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json({ status: 'success', message: 'Password Changed' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const resetToken = user.generateResetToken();
  // console.log(res);
  // await user.save({ validateBeforeSave: false });
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/resetpassword/${resetToken}`;
  // console.log(resetUrl);

  const message = `Forgot your password ? Submit your PATCH request with your new password and paswordConfirm  to ${resetUrl} .\n if didn't forgot password , Please ignore this email`;
  try {
    await sendMail({
      email: user.email,
      subject: 'your password reset token (valid for 10 min)',
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token send to email',
      resetUrl: resetUrl,
      user: user,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('Error occured in email sending'), 500);
  }
});

exports.signup = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const user = new User({
    email: email,
    password: password,
    name: name,
  });
  const result = await user.save();
  // console.log(result);
  res.status(200).json({
    message: 'succsessfully created',
    user: result,
    status: 'success',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError('not authenticated', 404));
    // return res.status(404).json({ message: "not authenticated" })
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    return next(
      new AppError('not authenticated : invalid username or passoword', 401)
    );
    // return res.status(401).json({ message: "not authenticated : invalid username or passoword" });
  }
  user.isOnline = true;
  const updatedUser = await user.save();
  // req.session.isOnline = true;
  // await req.session.save();

  const token = await updatedUser.generateToken();

  // const allUser = await User.find().select("-password");
  // coUser.lastMessage(req.userId);
  IOfunction('isOnline', 'check', null);
  // io.getIO().emit('isOnline', {
  //     action: 'check',
  //     user: allUser
  // });
  // req.session.token = token;
  // res.cookie("token", JSON.stringify(token), {
  //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  //     httpOnly: true
  // });
  res.status(200).json({ token: token, data: updatedUser, status: 'success' });
});

exports.logout = catchAsync(async (req, res, next) => {
  const existUser = await User.findById(req.userId);
  if (!existUser) {
    const error = new Error('User Not Found');
    error.statusCode = 404;
    throw error;
  }
  existUser.isOnline = false;
  await existUser.save();

  // req.session.isOnline = false;
  // await req.session.save();
  const allUser = await User.find().select('-password');
  IOfunction('isOnline', 'check', null);
  // io.getIO().emit('isOnline', {
  //     action: 'check',
  //     user: allUser
  // });

  res.status(200).json({
    message: 'User Logged Out',
  });
});
