import mongoose from 'mongoose'

const matchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true
    },
    matches: [
      {
        opponentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        },
        result: String,
        xp: Number,
      }
    ]
  },
  {
    timestamps: true
  }
)

const MatchHistory = mongoose.model('matchHistory', matchHistorySchema)
export default MatchHistory
