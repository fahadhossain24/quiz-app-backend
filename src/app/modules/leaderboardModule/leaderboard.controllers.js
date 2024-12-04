import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import leaderboardServices from './leaderboard.services.js'
import LeaderboardMessage from './leaderboardMessage.model.js'
import CustomError from '../../errors/index.js'

// controllers for retrive leaderboard based on period (weekly/monthly)
const getLeaderboardsByPeriod = async (req, res) => {
  const { period } = req.query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 9

  const skip = (page - 1) * limit

  const leaderboard = await leaderboardServices.getLeaderboardsByPeriod(period, skip, limit)

  const totalLeaders = await leaderboardServices.getLeadersCount()
  const totalPages = Math.ceil(totalLeaders / limit)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Leaderboard retrieved successfull!',
    meta: {
      totalLeaders,
      totalPages,
      currentPage: page,
      pageSize: limit
    },
    data: leaderboard
  })
}

// controller for craete leaderboard message
const createLeaderboardMessage = async (req, res) => {
  const getLeaderboardMessage = await LeaderboardMessage.findOne()

  if (getLeaderboardMessage) {
    throw new CustomError.BadRequestError('You already have a message. Please delete it before create new one!')
  }

  const leaderboardMessage = await LeaderboardMessage.create(req.body)
  if (!leaderboardMessage) {
    throw new CustomError.BadRequestError('Failed to create leaderboard message!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Leaderboard message create successfull!',
    data: leaderboardMessage
  })
}

// controller for get specific leaderboard message
const getSpecificLeaderboardMessage = async (req, res) => {
  // Fetch the leaderboard message by ID
  const getLeaderboardMessage = await LeaderboardMessage.findOne({})

  // Check if the message exists
  if (!getLeaderboardMessage) {
    throw new CustomError.BadRequestError('No message found for the provided leaderboard ID!')
  }

  // Send successful response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Leaderboard message retrieved successfully!',
    data: getLeaderboardMessage
  })
}

// Controller to update a specific leaderboard message by ID
const updateSpecificLeaderboardMessage = async (req, res) => {
  const { messageId } = req.params
  const updateData = req.body

  // Check if the message exists
  const getLeaderboardMessage = await LeaderboardMessage.findOne({ _id: messageId })

  if (!getLeaderboardMessage) {
    throw new CustomError.BadRequestError('No message found for the provided leaderboard ID!')
  }

  // Update the leaderboard message with the provided data
  const updatedLeaderboardMessage = await LeaderboardMessage.updateOne({ _id: messageId }, { $set: updateData }, { runValidators: true })

  // Check if the update was successful
  if (updatedLeaderboardMessage.modifiedCount === 0) {
    throw new CustomError.BadRequestError('Failed to update the leaderboard message!')
  }

  // Send successful response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Leaderboard message updated successfully!'
  })
}

// controller for delete leaderboard message
const deleteLeaderboardMessage = async (req, res) => {
  const { messageId } = req.params
  const getLeaderboardMessage = await LeaderboardMessage.findOne({ _id: messageId })

  if (!getLeaderboardMessage) {
    throw new CustomError.BadRequestError('No message found for the provided leaderboard ID!')
  }

  const deleteResult = await LeaderboardMessage.deleteOne({ _id: messageId })

  if (deleteResult.deletedCount === 0) {
    throw new CustomError.BadRequestError('Failed to delete the leaderboard message!')
  }

  // Send successful response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Leaderboard message deleted successfully!'
  })
}

export default {
  getLeaderboardsByPeriod,
  createLeaderboardMessage,
  deleteLeaderboardMessage,
  updateSpecificLeaderboardMessage,
  getSpecificLeaderboardMessage
}
