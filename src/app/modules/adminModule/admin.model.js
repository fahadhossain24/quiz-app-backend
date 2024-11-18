import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema(
  {
    adminId: {
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
    role: {
      type: String,
      enum: ['super-admin', 'admin'],
      default: 'admin'
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
    }
  },
  {
    timestamps: true
  }
)

adminSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10
    this.password = bcrypt.hashSync(this.password, saltRounds)
  }

  if (this.isModified('verification.code') && this.verification.code) {
    const saltRounds = 10
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds)
  }

  next()
})

adminSchema.methods.comparePassword = function (adminPlanePassword) {
  return bcrypt.compareSync(adminPlanePassword, this.password)
}

adminSchema.methods.compareVerificationCode = function (adminPlaneCode) {
  return bcrypt.compareSync(adminPlaneCode, this.verification.code)
}

const Admin = mongoose.model('admin', adminSchema)
export default Admin
