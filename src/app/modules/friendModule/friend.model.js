import mongoose from 'mongoose'

const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true
    },
    friends: [
      {
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        },
        playingAt: Date
      }
    ]
  },
  {
    timestamps: true
  }
)

const Friend = mongoose.model('friend', friendSchema)

export default Friend
