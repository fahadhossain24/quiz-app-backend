import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: [true, 'This email is already used!'],
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!']
    },
    country: {
        common: {
          type: String,
          required: true,
        },
        shortName: String,
        flagUrl: String,
    },
    university: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'disabled'],
      default: 'active'
    },
    image: {
      type: String,
      default: ''
    },
    verification: {
      code: {
        type: String,
        default: null
      },
      expireDate: {
        type: Date,
        default: null
      }
    },
    xp: Number,
    rank: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    // userPlatform: {
    //   type: String,
    //   enum: ['local', 'social'],
    //   default: 'local'
    // },
    // fcmToken: {
    //   type: String,
    //   default: null
    // }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  if (this.isModified('verification.code') && this.verification.code) {
    const saltRounds = 10;
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds);
  }

  next();
});

userSchema.methods.comparePassword = function (userPlanePassword) {
  return bcrypt.compareSync(userPlanePassword, this.password)
}

userSchema.methods.compareVerificationCode = function (userPlaneCode) {
  return bcrypt.compareSync(userPlaneCode, this.verification.code)
}

const User = mongoose.model('user', userSchema)

export default User
