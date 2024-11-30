import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import leaderboardServices from './leaderboard.services.js'

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

export default {
  getLeaderboardsByPeriod
}
