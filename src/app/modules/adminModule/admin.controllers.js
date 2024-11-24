import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import IdGenerator from '../../../utils/idGenerator.js'
import CustomError from '../../errors/index.js'
import adminServices from './admin.services.js'
import fileUploader from '../../../utils/fileUploader.js'
import sendMail from '../../../utils/sendEmail.js'
import Admin from './admin.model.js'
import config from '../../../config/index.js'
import jwtHelpers from '../../../healpers/healper.jwt.js'

// controller for create new admin
const createAdmin = async (req, res) => {
  const adminData = req.body
  const adminId = IdGenerator.generateUserId()

  adminData.adminId = adminId

  const admin = await adminServices.createAdmin(adminData)
  if (!admin) {
    throw new CustomError.BadRequestError('Failed to create new admin!')
  }

  const { password, ...adminInfoAcceptPass } = admin.toObject()

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Admin creation successfull',
    data: adminInfoAcceptPass
  })
}

// controller for get all admin
const getAllAdmin = async (req, res) => {
  const admins = await adminServices.getAllAdmin()
  const adminsAcceptSuperAdmin = admins.filter(admin => admin.role !== 'super-admin')
  // if (admins.length === 0) {
  //   throw new CustomError.BadRequestError('No admin found!')
  // }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin retrive successfull',
    data: adminsAcceptSuperAdmin
  })
}

// controller for get specific admin
const getSpecificAdmin = async (req, res) => {
  const { id } = req.params
  const admin = await adminServices.getSpecificAdmin(id)
  if (!admin) {
    throw new CustomError.BadRequestError('No admin found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin found successfull',
    data: admin
  })
}

// controller for update specific admin
const updateSpecificAdmin = async (req, res) => {
  const { id } = req.params
  const data = req.body
  if (data.adminId || data.password || data.email) {
    throw new CustomError.BadRequestError("You can't update adminId, email, password directly!")
  }

  const updatedAdmin = await adminServices.updateSpecificAdmin(id, data)
  if (!updatedAdmin.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update Admin!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin update successfull'
  })
}

// controller for change profile image of specific admin
const changeAdminProfileImage = async (req, res) => {
  const { id } = req.params
  const files = req.files

  const admin = await adminServices.getSpecificAdmin(id)

  const adminImagePath = await fileUploader(files, `admin-image-${admin.adminId}`, 'image')
  const updateAdmin = await adminServices.updateSpecificAdmin(id, {
    image: adminImagePath
  })

  if (!updateAdmin.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to change admin profile image!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin profile change successfull'
  })
}

// controller for delete specific admin
const deleteSpecificAdmin = async (req, res) => {
  const { id } = req.params
  const admin = await adminServices.deleteSpecificAdmin(id)
  if (!admin.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete admin!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Admin delete successfull'
  })
}

// admin auth
// controller for admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body
  const admin = await adminServices.getAdminByEmail(email)

  if (!admin) throw new CustomError.BadRequestError('Invalid email or password!')

  // check the password is correct
  const isPasswordMatch = await admin.comparePassword(password)

  if (!isPasswordMatch) throw new CustomError.BadRequestError('Invalid email or password')

  // generate token
  const payload = {
    adminId: admin.adminId,
    email: admin.email,
    role: admin.role
  }
  const accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret, config.jwt_access_token_expiresin)

  const refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret, config.jwt_refresh_token_expiresin)

  const adminInfo = {
    adminId: admin.adminId,
    email: admin.email,
    _id: admin._id,
    accessToken,
    refreshToken,
    status: admin.status,
    role: admin.role
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Login successfull',
    data: adminInfo
  })
}

// controller for send otp to admin
const sendOTP = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  const admin = await adminServices.getAdminByEmail(email)
  if (!admin) {
    throw new CustomError.BadRequestError('Admin not found!')
  }

  const code = IdGenerator.generateCode()
  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 5)
  const verification = {
    code,
    expireDate
  }

  admin.verification = verification
  await admin.save()

  // send verification mail
  const textContent = `
      Hi ${admin.fullName},
      
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

  const admin = await adminServices.getAdminByEmail(email)
  if (!admin) {
    throw new CustomError.BadRequestError('Admin not found!')
  }

  const isMatchOTP = await admin.compareVerificationCode(otp)
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!')
  }

  // set null verification object in admin model
  await Admin.findByIdAndUpdate(admin._id, {
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

  const admin = await adminServices.getAdminByEmail(email)
  if (!admin) {
    throw new CustomError.BadRequestError('Admin not found!')
  }

  admin.password = newPassword
  await admin.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull'
  })
}

// controller for change password
const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body

  const admin = await Admin.findById(id)
  if (!admin) {
    throw new CustomError.BadRequestError('Admin not found!')
  }

  // compare admin given old password and database saved password
  const isOldPassMatch = await admin.comparePassword(oldPassword)
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password')
  }

  admin.password = newPassword
  await admin.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull'
  })
}

export default {
  createAdmin,
  getAllAdmin,
  getSpecificAdmin,
  updateSpecificAdmin,
  changeAdminProfileImage,
  deleteSpecificAdmin,
  adminLogin,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword
}
