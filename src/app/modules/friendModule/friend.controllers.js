import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import friendServices from './friend.services.js'
import CustomError from '../../errors/index.js'

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

export default {
  getFriendsByUserId
}
