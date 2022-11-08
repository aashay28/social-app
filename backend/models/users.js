const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('./users');

const Message = require('./message');

const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'require field email'],
      minlength: [3, 'a email min or equal than 3 character'],
      maxlength: [30, 'a email max or equal than 30 character'],
      unique: true,
      lowercase: true,
      validate(value) {
        // if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        //     throw new Error("not valid Email");
        // }
        if (!validator.isEmail(value)) {
          throw new Error('not valid Email');
        }
      },
      // validate : [ validator.isEmail, "Please Enter Valid email"]
    },
    password: {
      type: String,
      required: [true, 'require field password'],
    },
    // confirmPassword: {
    //     type: String,
    //     required: [true, 'required field confirmPassword'],
    //     validate: {
    //         // This only works on CREATE and SAVE query
    //         validator: function(el) {
    //             return el === this.password;
    //         },
    //         message: 'Passwords are not the same!'
    //     }
    // },
    name: {
      type: String,
      required: [true, 'require field name'],
      maxlength: [20, 'a name max or equal than 20 character'],
      minlength: [3, 'a name min or equal than 3 character'],
    },
    image: {
      type: String,
      default: '/images/avatar.jpeg',
      required: [true, 'require field image avatar'],
    },
    isOnline: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.generateToken = async function () {
  return await jwt.sign(
    {
      email: this.email,
      userId: this._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

// AnimalSchema.statics.search = function search (name, cb) {
//     return this.where('name', new RegExp(name, 'i')).exec(cb);
//   }
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  console.log(this.passwordResetToken);
  return resetToken;
};

userSchema.statics.lastMessage = async function (userId, users) {
  let allUserInfo = [];
  if (!users) {
    var users = await this.find().select('-password -createdAt -updatedAt');
  }
  for (let u of users) {
    const message = await Message.findOne(
      {
        users: {
          $all: [userId, u._id.toString()],
        },
      },
      {},
      { sort: { createdAt: -1 } }
    ).select('message createdAt updatedAt -_id');

    if (message) {
      allUserInfo.push({
        ...u._doc,
        lastMessage: message.message,
        createdAt: message.createdAt,
      });
    } else {
      allUserInfo.push({
        ...u._doc,
        createdAt: '2022-05-13T07:32:17.216+00:00',
      });
    }
  }
  sortByDate(allUserInfo);
  return allUserInfo;
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // console.log(`current password ${this.password}`);
    this.password = await bcrypt.hash(this.password, 12);
    // console.log(`current password ${this.password}`);
    // this.confirmPassword = undefined;
  }
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const sortByDate = arr => {
  const sorter = (a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };
  arr.sort(sorter);
};
module.exports = mongoose.model('user', userSchema);
