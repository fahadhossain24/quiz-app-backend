import Friend from './friend.model.js'

// service for update(if created) friend by user
const updateFriend = async (playerId, friendId, playingAt) => {
  let friend = await Friend.findOne({ userId: playerId })

  if (friend) {
    // friend.friends.push({
    //   friendId,
    //   playingAt
    // })

    const existingFriendIndex = friend.friends.findIndex((f) => f.friendId.toString() === friendId.toString())

    if (existingFriendIndex !== -1) {
      friend.friends[existingFriendIndex].playingAt = playingAt
    } else {
      friend.friends.push({
        friendId,
        playingAt
      })
    }
  } else {
    friend = new Friend({
      userId: playerId,
      friends: [
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
const getFriendsByUserId = async (userId) => {
  return await Friend.findOne({ userId }).populate('friends.friendId').sort({ 'friends.playingAt': -1 })
}

export default {
  updateFriend,
  getFriendsByUserId
}
