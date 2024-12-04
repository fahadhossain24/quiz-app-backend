import mongoose from "mongoose";

const leaderboardMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        default: null
    },
}, {
    timestamps: true
})

const LeaderboardMessage = mongoose.model('leaderboardMessage', leaderboardMessageSchema)

export default LeaderboardMessage;