import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../../shared/sendResponse.js'
import CustomError from '../../../errors/index.js'
import quizServices from './quiz.services.js'
import questionServices from '../../questionModules/question/question.services.js'
import userServices from '../../userModule/user.services.js'
import IdGenerator from '../../../../utils/idGenerator.js'
import config from '../../../../config/index.js'

// controller for start new quiz
const startQuiz = async (req, res) => {
  const quizData = req.body

  const participantA = await userServices.getSpecificUser(quizData.participantA)
  const participantB = await userServices.getSpecificUser(quizData.participantB)
//   console.log(participantA, participantB)

  const randomQuestions = await questionServices.getRandomQuestion(Number(config.question_count))

  const quizId = IdGenerator.generateId()
  quizData.quizId = quizId
  quizData.participantA = participantA
  quizData.participantB = participantB
  quizData.questions = randomQuestions.map((question) => ({
    question: question.question,
    _mainId: question._id,
    questionId: question.questionId,
    readTime: question.readTime,
    answerTime: question.answerTime,
    options: question.options,
    useCount: question.useCount,
    speciality: question.speciality,
    condition: question.condition,
    explanation: question.explanation
  }))

  const quiz = await quizServices.startQuiz(quizData)
  if (!quiz) {
    throw new CustomError.BadRequestError('Failed to start quiz!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New quiz start successfull!',
    data: quiz
  })
}

export default {
  startQuiz
}
