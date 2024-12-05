import { DateTime } from 'luxon'
import Leaderboard from './leaderboard.model.js'

// service for get(if found) or create(if not found) leaderboard of a user
const getOrCreateLeaderboardOfAUser = async (userId) => {
  let leaderboard = await Leaderboard.findOne({ userId })

  if (!leaderboard) {
    const totalUserCount = await Leaderboard.countDocuments()
    const payload = {
      userId,
      rank: totalUserCount
    }
    leaderboard = await Leaderboard.create(payload)
  }

  return leaderboard
}

// service for update leaderboard with xp by userId
const updateLeaderboardXPByUser = async (userId, xp) => {
  return await Leaderboard.updateOne(
    { userId },
    { xp },
    {
      runValidators: true
    }
  )
}

// service for update leaderboard rank
const updateLeaderboardRank = async () => {
  const leaderboards = await Leaderboard.find().sort({ xp: -1 })

  // Update each entry with the new rank based on the sorted order
  for (let i = 0; i < leaderboards.length; i++) {
    const leaderboard = leaderboards[i]
    const newRank = i + 1 // Rank starts at 1 for the highest XP
    if (leaderboard.rank !== newRank) {
      leaderboard.rank = newRank
      await leaderboard.save()
    }
  }
}

// service for get leaderboard by userId
const getLeaderboardByUserId = async (userId) => {
  return await Leaderboard.findOne({ userId }).select(['xp', 'rank'])
}

// service for retrive leaderboards based on period(weekly/monthly)
const getLeaderboardsByPeriod = async (period, skip, limit) => {
  let dateFilter = {}

  // Determine the date filter based on the period using Luxon
  if (period === 'weekly') {
    dateFilter = { updatedAt: { $gte: DateTime.now().startOf('week').toJSDate() } }
  } else if (period === 'monthly') {
    dateFilter = { updatedAt: { $gte: DateTime.now().startOf('month').toJSDate() } }
  }

  const leaderboard = await Leaderboard.find(dateFilter)
    .populate('userId', 'fullName country university email image xp rank')
    .sort({ xp: -1 })
    .skip(Number(skip)) 
    .limit(Number(limit))
    .exec()

  return leaderboard
}

const getLeadersCount = async () => {
  return (await Leaderboard.find()).length
}

export default {
  getOrCreateLeaderboardOfAUser,
  updateLeaderboardXPByUser,
  updateLeaderboardRank,
  getLeaderboardByUserId,
  getLeaderboardsByPeriod,
  getLeadersCount
}
