import sendResponse from '../../../shared/sendResponse'
import fileUploader from '../../../utils/fileUploader'
import IdGenerator from '../../../utils/idGenerator'
import sendMail from '../../../utils/sendEmail'
import userServices from './user.services'

/* eslint-disable no-unused-vars */
const { StatusCodes } = require('http-status-codes')
// const sendResponse = require('../../../shared/sendResponse');
// const fileUploader = require('../../../utils/fileUploader');
const CustomError = require('../../errors')
const {
  createVerification
} = require('../varificationModule/verification.services')
// const userServices = require('./user.services');
const { server_base_url } = require('../../../config')
// const sendMail = require('../../../utils/sendEmail');

// controller for create new user
const createUser = async (req, res) => {
  const userData = req.body

  const userId = IdGenerator.generateUserId()
  const userImagePath = await fileUploader(
    req.files,
    `user-image-${userId}`,
    'image'
  )

  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 30)

  userData.userId = userId
  userData.image = userImagePath
  userData.verification = {
    code: IdGenerator.generateCode(),
    expireDate
  }

  const user = await userServices.createUser(userData)
  if (!user) {
    throw new CustomError.BadRequestError('Failed to create new user!')
  }

  const { password, ...userInfoAcceptPass } = user.toObject();

  // send email verification mail
  const content = `Your email veirfication code is ${userData?.verification?.code}`
  // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
  // const content = `Click the following link to verify your email: ${verificationLink}`
  const mailOptions = {
    from: 'fahadhossain0503@gmail.com',
    to: userData.email,
    subject: 'Quiz App - Email Verification',
    text: content
  }

  sendMail(mailOptions)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User creation successfull',
    data: userInfoAcceptPass
  })
}

// controller for get specific user
const getSpecificUser = async (req, res) => {
  const { id } = req.params
  const user = await userServices.getSpecificUser(id)
  if (!user) {
    throw new CustomError.BadRequestError('No user found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User found successfull',
    data: user
  })
}

// controller for delete specific user
const deleteSpecificUser = async (req, res) => {
  const { id } = req.params
  const user = await userServices.deleteSpecificUser(id)
  if (!user.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete user!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User delete successfull'
  })
}

// controller for update specific user
const updateSpecificUser = async (req, res) => {
  const { id } = req.params
  const data = req.body
  if (data.userId || data.password || data.isEmailVerified) {
    throw new CustomError.BadRequestError(
      "You can't update usesrId, verified status and password directly!"
    )
  }

  const updatedUser = await userServices.updateSpecificUser(id, data)
  if (!updatedUser.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update user!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User update successfull'
  })
}

// controller for change profile image of specific user
const changeUserProfileImage = async (req, res) => {
  const { id } = req.params
  const files = req.files

  const user = await userServices.getSpecificUser(id)

  const userImagePath = await fileUploader(
    files,
    `user-image-${user.userId}`,
    'image'
  )
  const updateUser = await userServices.updateSpecificUser(id, {
    image: userImagePath
  })

  if (!updateUser.modifiedCount) {
    throw new CustomError.BadRequestError(
      'Failed to change user profile image!'
    )
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User profile change successfull'
  })
}

export default {
  createUser,
  getSpecificUser,
  deleteSpecificUser,
  updateSpecificUser,
  changeUserProfileImage
}
