import mongoose from 'mongoose'
import { shuffleQuestionOptions } from './question.utils.js'

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true
    },
    question: {
      type: String,
      required: true,
      unique: true
    },
    readTime: {
      type: String,
      required: true
    },
    answerTime: {
      type: String,
      required: true,
      default: '10s'
    },
    options: {
      answer: {
        type: String,
        required: true
      },
      optionA: {
        type: String,
        required: true
      },
      optionB: {
        type: String,
        required: true
      },
      optionC: {
        type: String,
        required: true
      },
      optionD: {
        type: String,
        required: true
      },
      optionE: {
        type: String,
        required: true
      }
    },
    useCount: {
      type: Number,
      default: 0
    },
    speciality: {
      type: String,
      required: true,
      unique: true
    },
    condition: {
      type: String,
      required: true,
      unique: true
    },
    explanation: String
  },
  {
    timestamps: true
  }
)

questionSchema.pre('save', function (next) {
  this.options = shuffleQuestionOptions(this.options)
  next()
})

const Question = mongoose.model('questioon', questionSchema)

export default Question
