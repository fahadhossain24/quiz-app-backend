import MatchHistory from './matchHistory.model.js'

// service for update(if created) match history by user
const updateMatchHistory = async (playerId, opponentId, result, xp) => {
  let matchHistory = await MatchHistory.findOne({ userId: playerId })
  // console.log(matchHistory)

  if (matchHistory) {
    matchHistory.matches.push({
      opponentId,
      result,
      xp
    })
  } else {
    matchHistory = new MatchHistory({
      userId: playerId,
      matches: [
        {
          opponentId,
          result,
          xp
        }
      ]
    })
  }

  await matchHistory.save()
  return matchHistory
}

// service for get recent match history by userId
const recentMatchHistoryByUserId = async(userId) => {
  return await MatchHistory.findOne({userId}).populate('matches.opponentId', 'country _id userId fullName email university image rank xp').sort({'matches.date' : -1})
}

export default {
  updateMatchHistory,
  recentMatchHistoryByUserId
}
