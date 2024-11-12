import mongoose from 'mongoose'

const questionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      unique: true,
      required: true
    },
    questions: [
      {
        _mainId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'question'
        },
        questionId: String,
        isCurrect: Boolean,
        performAnswer: {
            type: String,
            default: null
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const QuestionHistory = mongoose.model('questionHistory', questionHistorySchema)

export default QuestionHistory
