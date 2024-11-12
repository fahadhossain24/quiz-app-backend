import Leaderboard from "./leaderboard.model.js"

// service for get(if found) or create(if not found) leaderboard of a user
const getOrCreateLeaderboardOfAUser = async(userId) => {
    let leaderboard = await Leaderboard.findOne({userId});

    if(!leaderboard){
        leaderboard = await Leaderboard.create({userId})
    }

    return leaderboard;
}

// service for update leaderboard with xp by userId
const updateLeaderboardXPByUser = async(userId, xp) => {
    return await Leaderboard.updateOne({userId}, {xp}, {
        runValidators: true
})}

// service for update leaderboard rank
const updateLeaderboardRank = async() => {
    const leaderboards = await Leaderboard.find().sort({xp: -1})

     // Update each entry with the new rank based on the sorted order
     for (let i = 0; i < leaderboards.length; i++) {
        const leaderboard = leaderboards[i];
        const newRank = i + 1; // Rank starts at 1 for the highest XP
        if (leaderboard.rank !== newRank) {
            leaderboard.rank = newRank;
          await leaderboard.save();
        }
      }
}

// service for get leaderboard by userId
const getLeaderboardByUserId = async(userId) => {
    return await Leaderboard.findOne({userId}).select(['xp', 'rank']);
}


export default {
    getOrCreateLeaderboardOfAUser,
    updateLeaderboardXPByUser,
    updateLeaderboardRank,
    getLeaderboardByUserId,
}