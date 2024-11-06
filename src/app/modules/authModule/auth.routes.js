import express from 'express'
import authControllers from './auth.controllers.js'
import requestValidator from '../../middlewares/requestValidator.js'
import AuthValidation from './auth.validation.js'
// const requestValidator = require('../../middlewares/requestValidator')
// const AuthValidation = require('./auth.validation')
// const authorization = require('../../middlewares/authorization')

const authRoute = express.Router()

// route for login
authRoute.post(
  '/login',
  requestValidator(AuthValidation.loginValidationZodSchema),
  authControllers.userLogin
)

// route for resend email verification code
authRoute.post('/email-verification/resend-code', authControllers.resendEmailVerificationCode)

// route for user email verify
authRoute.get(
    '/verify-email',
    authControllers.userEmailVerify
)

// route for send password reset OTP
authRoute.post('/forget-password/send-otp', authControllers.sendOTP)

// route for verify OTP
authRoute.post('/verify-otp', authControllers.verifyOTP)

// route for reset password
authRoute.post('/reset-password', authControllers.resetPassword)

// route for change password
authRoute.post('/change-password', authControllers.changePassword)

// route for user stability (get new accesstoken)
authRoute.post('/refresh-token',  authControllers.getAccessTokenByRefreshToken)


export default authRoute
