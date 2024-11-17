import mongoose from 'mongoose'

const reviewModeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      unique: true
    },
    questions: [
      {
        _mainId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'question',
        },
        questionId: String,
        isCurrect: Boolean,
        performAnswer: {
          type: String,
          default: null
        },
        intervalCount: {
          type: Number,
          default: 1,
          max: 7
        },
        sleep: {
          type: Boolean,
          default: false
        },
        condition: {
          type: String,
          enum: ['new', 'due'],
          default: 'new'
        },
        nextAvailableDate: {
          type: Date,
          default: Date.now // When the question becomes available again
        }
      }
    ],
    intervalSettings: {
      type: [Number], 
    }
  },
  {
    timestamps: true
  }
);

const ReviewMode = mongoose.model('reviewMode', reviewModeSchema);

export default ReviewMode;

