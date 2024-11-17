import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../../shared/sendResponse.js'
import CustomError from '../../../errors/index.js'
import quizServices from './quiz.services.js'
import questionServices from '../../questionModules/question/question.services.js'
import userServices from '../../userModule/user.services.js'
import IdGenerator from '../../../../utils/idGenerator.js'
import config from '../../../../config/index.js'
import { io, connectedUsers } from '../../../../server.js'

// controller for init new quiz
const initQuiz = async (req, res) => {
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

  // Initialize and save the quiz in the database
  const quiz = await quizServices.initQuiz(quizData)
  if (!quiz) {
    throw new CustomError.BadRequestError('Failed to start quiz!')
  }

  // Add participant A to the quiz room and invite participant B
  // io.in(participantA._id).socketsJoin(quizId) // Add Player A to the room

  const participantASocketId = connectedUsers[participantA._id];
  if (participantASocketId) {
    io.in(participantASocketId).socketsJoin(quizId); // Player A joins the room
  }

  const participantBSocketId = connectedUsers[participantB._id]
  if (participantBSocketId) {
    io.to(participantBSocketId).emit('quiz-invitation', { quizId, player: participantA, quiz })
  }
  // console.log(connectedUsers)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New quiz initialization successfull!',
    data: quiz
  })
}

// controller for init new quiz 1 vs 1
const initQuizOneVsOne = async (req, res) => {
  const quizData = req.body
  // player

  const player = await userServices.getSpecificUser(quizData.player)

  const activeUsers = await userServices.getUsers({ isActive: true })
  if (activeUsers.length === 0) {
    throw new CustomError.BadRequestError('No active users available for pairing as opponent!')
  }

  // Randomly select opponent from active users
  const randomIndex = Math.floor(Math.random() * activeUsers.length)
  const opponent = activeUsers[randomIndex]

  const randomQuestions = await questionServices.getRandomQuestion(Number(config.question_count))

  const quizId = IdGenerator.generateId()
  quizData.quizId = quizId
  quizData.participantA = player
  quizData.participantB = opponent
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

  const quiz = await quizServices.initQuiz(quizData)
  if (!quiz) {
    throw new CustomError.BadRequestError('Failed to start quiz!')
  }

  // Add participant A to the quiz room and invite participant B
  // io.in(player._id).socketsJoin(quizId) // Add Player to the room
  // io.to(opponent._id).emit('quiz-invitation', { quizId, participantId: opponent._id })


  const participantASocketId = connectedUsers[player._id];
  if (participantASocketId) {
    io.in(participantASocketId).socketsJoin(quizId); // Player A joins the room
  }

  const participantBSocketId = connectedUsers[opponent._id]
  if (participantBSocketId) {
    io.to(participantBSocketId).emit('quiz-invitation', { quizId, player, quiz })
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'One vs One quiz start successfull!',
    data: quiz
  })
}

export default {
  initQuiz,
  initQuizOneVsOne
}


