import sendResponse from '../../../shared/sendResponse.js'
import fileUploader from '../../../utils/fileUploader.js'
import IdGenerator from '../../../utils/idGenerator.js'
import sendMail from '../../../utils/sendEmail.js'
import userServices from './user.services.js'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../../errors/index.js'
import leaderboardServices from '../leaderboardModule/leaderboard.services.js'
import jwtHelpers from '../../../healpers/healper.jwt.js'
import config from '../../../config/index.js'
// import {getOrCreateLeaderboardOfAUser} from '../leaderboardModule/leaderboard.services.js'

// controller for create new user
const createUser = async (req, res) => {
  const userData = req.body
  const userId = IdGenerator.generateUserId()

  const expireDate = new Date()
  expireDate.setMinutes(expireDate.getMinutes() + 30)

  userData.userId = userId
  userData.verification = {
    code: IdGenerator.generateCode(),
    expireDate
  }

  let accessToken, refreshToken
  if (userData.isSocial) {
    userData.isEmailVerified = true

    const payload = {
      userId: userId,
      email: userData.email,
      role: 'user'
    }
    accessToken = jwtHelpers.createToken(payload, config.jwt_access_token_secret, config.jwt_access_token_expiresin)
    refreshToken = jwtHelpers.createToken(payload, config.jwt_refresh_token_secret, config.jwt_refresh_token_expiresin)
  }

  const user = await userServices.createUser(userData)
  if (!user) {
    throw new CustomError.BadRequestError('Failed to create new user!')
  }

  const leaderboard = await leaderboardServices.getOrCreateLeaderboardOfAUser(user._id)
  user.rank = leaderboard.rank
  await user.save()

  const { password, ...userInfoAcceptPass } = user.toObject()

  if (!userData.isSocial) {
    // send email verification mail
    const content = `Your email veirfication code is ${userData?.verification?.code}`
    // const verificationLink = `${server_base_url}/v1/auth/verify-email/${user._id}?userCode=${userData.verification.code}`
    // const content = `Click the following link to verify your email: ${verificationLink}`
    const mailOptions = {
      from: 'admin@medroyale.net',
      to: userData.email,
      subject: 'Medroyale - Email verification',
      text: content,
      replyTo: 'no-reply@medroyale.net', // Disable replies
      headers: {
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        Precedence: 'bulk',
        'Auto-Submitted': 'auto-generated'
      }
    }
    sendMail(mailOptions)
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'User creation successfull',
    data: { ...userInfoAcceptPass, accessToken, refreshToken }
  })
}

// controller for get specific user
const getSpecificUser = async (req, res) => {
  const { id } = req.params
  const user = await userServices.getSpecificUser(id)
  if (!user) {
    throw new CustomError.BadRequestError('No user found!')
  }

  // const userLeaderboard = await leaderboardServices.getLeaderboardByUserId(id);
  // console.log(userLeaderboard)

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
  if (data.userId || data.password || data.email || data.isEmailVerified) {
    throw new CustomError.BadRequestError("You can't update usesrId, email, verified status and password directly!")
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
  // console.log(files)
  const user = await userServices.getSpecificUser(id)
  // console.log(req.files)
  // const fileUrl = req.files.image[0].location

  const userImagePath = await fileUploader(files, `user-image-${user.userId}`, 'image')
  const updateUser = await userServices.updateSpecificUser(id, {
    image: userImagePath
  })

  if (!updateUser.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to change user profile image!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'User profile change successfull'
  })
}

// controller for search users(opponents)
const findOpponent = async (req, res) => {
  const { fullName, email, country, university, profession } = req.query

  const searchCriteria = {}

  const buildMultiWordRegex = (query) => {
    const words = query.trim().split(/\s+/) // Split by spaces and remove extra whitespace
    const regexPattern = words.map((word) => `(?=.*${word})`).join('') // Create pattern to match all words
    return new RegExp(regexPattern, 'i') // 'i' for case-insensitive
  }

  if (fullName) {
    searchCriteria.fullName = buildMultiWordRegex(fullName)
  }
  if (email) {
    searchCriteria.email = buildMultiWordRegex(email)
  }
  if (country) {
    searchCriteria['country.common'] = buildMultiWordRegex(country)
  }
  if (university) {
    searchCriteria.university = buildMultiWordRegex(university)
  }
  if (profession) {
    searchCriteria.profession = buildMultiWordRegex(profession)
  }
  searchCriteria.isActive = true
  // console.log(searchCriteria)

  // Perform the search query
  const users = await userServices.searchOpponent(searchCriteria)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Opponents retrive successfull.',
    data: users
  })
}

// controller for update status (online/offline) of user
const updateOnlineStatus = async (req, res) => {
  const { userId, isActive } = req.body

  if (typeof isActive !== 'boolean') {
    throw new CustomError.BadRequestError('isActive must be a boolean type value!')
  }

  const user = await userServices.getSpecificUser(userId)
  if (!user) {
    throw new CustomError.BadRequestError('No user found!')
  }

  user.isActive = isActive
  await user.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Update successfull.'
  })
}

// controller for get recent user
const getRecentUsers = async (req, res) => {
  const users = await userServices.getRecentUsers()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Recent users retrive successfull.',
    data: users
  })
}

export default {
  createUser,
  getSpecificUser,
  deleteSpecificUser,
  updateSpecificUser,
  changeUserProfileImage,
  findOpponent,
  updateOnlineStatus,
  getRecentUsers
}
