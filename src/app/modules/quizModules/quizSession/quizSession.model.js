import mongoose from 'mongoose'

const quizSessionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'quiz'
    },
    participantId: String,
    score: Number,
    failedQuestions: [
        {
            _mainId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'question'
            },
            questionId: String,
            performAnswer: String,
        }
    ],
  },
  {
    timestamps: true
  }
)

// Pre-save hook to enforce two submissions per quiz
quizSessionSchema.pre('save', async function (next) {
  // Use `this.constructor` to refer to the model
  const existingSessionsCount = await this.constructor.countDocuments({ quizId: this.quizId })

  // If there are already 2 submissions, prevent saving
  if (existingSessionsCount >= 2) {
    const error = new Error('This quiz already has two submissions. No further submissions are allowed.')
    error.statusCode = 400
    return next(error)
  }

  next()
})

const QuizSession = mongoose.model('quizSession', quizSessionSchema)

export default QuizSession


