import { StatusCodes } from 'http-status-codes'
import jwtHelpers from '../../../healpers/healper.jwt.js'
import sendResponse from '../../../shared/sendResponse.js'
import authServices from './auth.services.js'
import IdGenerator from '../../../utils/idGenerator.js'
import User from '../userModule/user.model.js'
import sendMail from '../../../utils/sendEmail.js'
import CustomError from '../../errors/index.js'
import config from '../../../config/index.js'
import userServices from '../userModule/user.services.js'

// controller for user login
const userLogin = async (req, res) => {
  const { email, password } = req.body
  const user = await authServices.getUserByEmail(email)

  if (!user) throw new CustomError.BadRequestError('Invalid email or password!')

  // check the password is correct
  const isPasswordMatch = await user.comparePassword(password)

  if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password')

  // generate token
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  }
  const accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret, config.jwt_access_token_expiresin)

  const refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret, config.jwt_refresh_token_expiresin)

  const userInfo = {
    userId: user.userId,
    email: user.email,
    _id: user._id,
    accessToken,
    refreshToken,
    isEmailVerified: user.isEmailVerified
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Login successfull',
    data: userInfo
  })
}

// // controller for social auth (login/signup)
// const socialAuth = async (req, res) => {
//   const { fcmToken } = req.body

//   req.body.userPlatform = 


//   if (!userInfo) {
//     throw new CustomError.BadRequestError('Invalid social login token!')
//   }

//   const existingUser = await User.findOne({ socialId: userInfo.id, socialProvider })
//   if (existingUser) {
//     // Existing user login
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       status: 'success',
//       message: 'Login successful',
//       data: existingUser
//     })
//   } else {
//     // New social user sign-up
//     const newUser = new User({
//       fullName: userInfo.name,
//       email: userInfo.email,
//       socialId: userInfo.id,
//       socialProvider,
//       loginMethod,
//       isEmailVerified: true,
//       image: userInfo.picture // Assume profile picture URL is provided
//     })

//     const savedUser = await newUser.save()
//     sendResponse(res, {
//       statusCode: StatusCodes.CREATED,
//       status: 'success',
//       message: 'User creation successful',
//       data: savedUser
//     })
//   }
// }

// controller for resend email verification code
const resendEmailVerificationCode = async (req, res) => {
  const { email } = req.body
  const code = IdGenerator.generateCode()
  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 5)
  const verification = {
    code: code,
    expireDate
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.BadRequestError('No user found!')
  }

  user.verification = verification
  await user.save()

  // send email verification mail
  const content = `Your email veirfication code is ${verification?.code}`
  // const verificationLink = `${config.server_base_url}/v1/auth/verify-email/${user._id}?userCode=${verification.code}`
  // const content = `Click the following link to verify your email: ${verificationLink}`
  const mailOptions = {
    from: 'fahadhossain0503@gmail.com',
    to: email,
    subject: 'Quiz App - Email Verification',
    text: content
  }

  sendMail(mailOptions)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification code resend successfull'
  })
}

// controller for verify email
const userEmailVerify = async (req, res) => {
  const { email, code } = req.body
  const user = await authServices.getUserByEmail(email)
  if (!user) throw new CustomError.BadRequestError('User not found!')

  const isVerificationCodeMatch = await user.compareVerificationCode(code)
  if (!isVerificationCodeMatch) {
    throw new CustomError.BadRequestError('Invalid code!')
  }

  const now = new Date()
  if (user.verification.expireDate && user.verification.expireDate < now) {
    throw new CustomError.BadRequestError('Sorry, Email verification Code using date expired!')
  }

  // update the email verification status of user
  await User.findByIdAndUpdate(user._id, { isEmailVerified: true })

  // set null verification object in user model
  await User.findByIdAndUpdate(user._id, {
    verification: { code: null, expireDate: null }
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Email verification successfull'
  })
}

// controller for send otp
const sendOTP = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  const user = await authServices.getUserByEmail(email)
  if (!user) {
    throw new CustomError.BadRequestError('User not found!')
  }

  const code = IdGenerator.generateCode()
  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 5)
  const verification = {
    code,
    expireDate
  }

  user.verification = verification
  await user.save()

  // send verification mail
  const textContent = `
    Hi ${user.fullName},
    
    You have requested to reset your password. Please use the following One-Time Password (OTP) to complete the process. This OTP is valid for 5 minutes.
    
    Your OTP: ${code}
    
    If you did not request this, please ignore this email and your password will remain unchanged.
    
    For security reasons, do not share this OTP with anyone.
    
    Best regards,
    Quiz Managing Team
    
    Need help? Contact our support team at support@quizapp.com.
    © 2024 Quiz App. All rights reserved.
    `

  const mailOptions = {
    from: 'fahadhossain0503@gmail.com',
    to: email,
    subject: 'Quiz App - Password Reset OTP',
    text: textContent
  }

  sendMail(mailOptions)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.'
  })
}

// controller for verify otp
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  const user = await authServices.getUserByEmail(email)
  if (!user) {
    throw new CustomError.BadRequestError('User not found!')
  }

  const isMatchOTP = await user.compareVerificationCode(otp)
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!')
  }

  // set null verification object in user model
  await User.findByIdAndUpdate(user._id, {
    verification: { code: null, expireDate: null }
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'OTP match successfull'
  })
}

// controller for reset password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  const user = await authServices.getUserByEmail(email)
  if (!user) {
    throw new CustomError.BadRequestError('User not found!')
  }

  user.password = newPassword
  await user.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull'
  })
}

// controller for change password
const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body

  const user = await User.findById(id)
  if (!user) {
    throw new CustomError.BadRequestError('User not found!')
  }

  // compare user given old password and database saved password
  const isOldPassMatch = await user.comparePassword(oldPassword)
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password')
  }

  user.password = newPassword
  await user.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull'
  })
}

// controller for get access token by refresh token
const getAccessTokenByRefreshToken = async (req, res) => {
  const { refresh_token } = req.body
  const actualRefreshToken = refresh_token.split(' ')[1]

  const tokenPayload = jwtHelpers.verifyToken(actualRefreshToken, config.jwt_refresh_token_secret)
  if (!tokenPayload) {
    throw new CustomError.BadRequestError('Invalid refresh token!')
  }

  const user = await authServices.getUserByEmail(tokenPayload.email)
  if (!user) {
    throw new CustomError.BadRequestError('User not found!')
  }

  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  }

  const newAccessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret, config.jwt_access_token_expiresin)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'New access token created using refresh token. User logged In successful',
    data: {
      accessToken: newAccessToken,
      refreshToken: actualRefreshToken
    }
  })
}

export default {
  userLogin,
  resendEmailVerificationCode,
  userEmailVerify,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  getAccessTokenByRefreshToken
}
