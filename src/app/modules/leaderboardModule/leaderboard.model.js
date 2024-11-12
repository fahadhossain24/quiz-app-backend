import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
})

const Leaderboard = mongoose.model('leaderboard', leaderboardSchema)

export default Leaderboard;