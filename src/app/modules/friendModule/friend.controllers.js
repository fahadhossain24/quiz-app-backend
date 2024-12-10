import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import friendServices from './friend.services.js'
import CustomError from '../../errors/index.js'
import Friend from './friend.model.js'

// controllers for get friends by user id
const getFriendsByUserId = async (req, res) => {
  const { userId } = req.params
  if (!userId) {
    throw new CustomError.BadRequestError('Missing userId in request params!')
  }
  const friend = await friendServices.getFriendsByUserId(userId)
  if (!friend) {
    throw new CustomError.BadRequestError('No friend found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Friends retrive successfull!',
    data: friend
  })
}

// controller for add friend
const addFriend = async (req, res) => {
  const { userId, friendId } = req.body

  if (!userId || !friendId) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  // Find the user by their userId
  const user = await Friend.findOne({ userId })

  if (!user) {
    throw new CustomError.NotFoundError('User not found!')
  }

  // Check if the friendId already exists in the user's friends list
  const isFriend = user.friends.some((friend) => friend.friendId.toString() === friendId)

  if (isFriend) {
    throw new CustomError.BadRequestError('The user already added with you!')
  }

  user.friends.push({
    friendId: friendId,
    playingAt: null
  })
  await user.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Friends addedd successfull!'
  })
}

export default {
  getFriendsByUserId,
  addFriend
}
