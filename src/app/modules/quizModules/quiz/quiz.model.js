import mongoose, { mongo } from 'mongoose'

const quizSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      unique: true
    },
    participantA: {
      fullName: String,
      country: {
        common: String,
        shortName: String,
        flagUrl: String
      },
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      university: String,
      profession: String,
      image: String,
      rank: String
    },
    participantB: {
      fullName: String,
      country: {
        common: String,
        shortName: String,
        flagUrl: String
      },
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      university: String,
      profession: String,
      image: String,
      rank: String
    },
    questions: [
      {
        question: String,
        _mainId: mongoose.Schema.Types.ObjectId, 
        questionId: String,
        readTime: String,
        answerTime: String,
        options: {
          answer: String,
          optionA: String,
          optionB: String,
          optionC: String,
          optionD: String,
          optionE: String
        },
        useCount: Number,
        speciality: String,
        condition: String,
        explanation: String
      }
    ]
  },
  {
    timestamps: true
  }
)

const Quiz = mongoose.model('quiz', quizSchema)
export default Quiz
