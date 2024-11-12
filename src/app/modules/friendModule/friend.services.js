import Friend from './friend.model.js'

// service for update(if created) friend by user
const updateFriend = async (playerId, friendId, playingAt) => {
  let friend = await Friend.findOne({ userId: playerId })

  if (friend) {
    friend.friends.push({
      friendId,
      playingAt
    })
  } else {
    friend = new Friend({
      userId: friendId,
      matches: [
        {
          friendId,
          playingAt
        }
      ]
    })
  }

  await friend.save()
  return friend
}

// service for get friends by userId
const getFriendsByUserId = async(userId) => {
    return await Friend.findOne({userId}).sort({'friends.playingAt' : -1})
}

export default {
  updateFriend,
  getFriendsByUserId,
}
