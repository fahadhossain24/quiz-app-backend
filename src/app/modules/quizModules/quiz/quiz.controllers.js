import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../../shared/sendResponse.js'
import CustomError from '../../../errors/index.js'
import quizServices from './quiz.services.js'
import questionServices from '../../questionModules/question/question.services.js'
import userServices from '../../userModule/user.services.js'
import IdGenerator from '../../../../utils/idGenerator.js'
import config from '../../../../config/index.js'
import { io, connectedUsers, activeAppUsers } from '../../../../server.js'

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

  const participantASocketId = connectedUsers[participantA._id]
  if (participantASocketId) {
    io.in(participantASocketId).socketsJoin(quizId) // Player A joins the room
  }

  const participantBSocketId = connectedUsers[participantB._id]
  if (participantBSocketId) {
    // console.log(quiz)
    io.to(participantBSocketId).emit('quiz-invitation', { quizId, quiz })
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
// const initQuizOneVsOne = async (req, res) => {
//   const quizData = req.body
//   // player

//   const player = await userServices.getSpecificUser(quizData.player)

//   const activeUsers = await userServices.getUsers(activeAppUsers)
//   // console.log(activeUsers)
//   const otherUserAcceptPlayer = activeUsers.filter((user) => user._id.toString() !== player._id.toString())
//   // console.log(otherUserAcceptPlayer)
//   if (otherUserAcceptPlayer.length === 0) {
//     throw new CustomError.BadRequestError('No active users available for pairing as opponent!')
//   }

//   // Randomly select opponent from active users
//   const randomIndex = Math.floor(Math.random() * otherUserAcceptPlayer.length)
//   const opponent = otherUserAcceptPlayer[randomIndex]
//   // console.log(opponent)

//   const randomQuestions = await questionServices.getRandomQuestion(Number(config.question_count))

//   const quizId = IdGenerator.generateId()
//   quizData.quizId = quizId
//   quizData.participantA = player
//   quizData.participantB = opponent
//   quizData.questions = randomQuestions.map((question) => ({
//     question: question.question,
//     _mainId: question._id,
//     questionId: question.questionId,
//     readTime: question.readTime,
//     answerTime: question.answerTime,
//     options: question.options,
//     useCount: question.useCount,
//     speciality: question.speciality,
//     condition: question.condition,
//     explanation: question.explanation
//   }))

//   const quiz = await quizServices.initQuiz(quizData)
//   if (!quiz) {
//     throw new CustomError.BadRequestError('Failed to start quiz!')
//   }

//   // Add participant A to the quiz room and invite participant B
//   // io.in(player._id).socketsJoin(quizId) // Add Player to the room
//   // io.to(opponent._id).emit('quiz-invitation', { quizId, participantId: opponent._id })

//   const participantASocketId = connectedUsers[player._id]
//   if (participantASocketId) {
//     io.in(participantASocketId).socketsJoin(quizId) // Player A joins the room
//   }

//   const participantBSocketId = connectedUsers[opponent._id]
//   if (participantBSocketId) {
//     io.to(participantBSocketId).emit('quiz-invitation', { quizId, quiz })
//   }

//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     status: 'success',
//     message: 'One vs One quiz start successfull!',
//     data: quiz
//   })
// }

// controller for init new quiz 1 vs 1
let queue = [] // Array to track players waiting for a match
let activePlayers = new Set() // Set to track players currently playing a quiz

const initQuizOneVsOne = async (req, res) => {
  const quizData = req.body
  const playerId = quizData.player // Player who clicked "Play"

  // Check if the player is already in an active quiz or in the queue
  if (activePlayers.has(playerId)) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      status: 'error',
      message: 'You are already in a quiz or waiting in the queue!'
    })
  }

  const player = await userServices.getSpecificUser(playerId)
  if (!player) {
    throw new CustomError.BadRequestError('Player not found!')
  }

  // Add player to the queue and mark them as active
  queue.push(playerId)
  activePlayers.add(playerId) // Mark player as waiting for a match

  // If there are enough players in the queue, start the quiz
  if (queue.length >= 2) {
    // Match players in pairs
    while (queue.length >= 2) {
      // Get the first two players in the queue
      const playerAId = queue.shift() // First player
      const playerBId = queue.shift() // Second player

      const playerA = await userServices.getSpecificUser(playerAId)
      const playerB = await userServices.getSpecificUser(playerBId)

      // Fetch random questions for the quiz
      const randomQuestions = await questionServices.getRandomQuestion(Number(config.question_count))

      // Generate a new quiz ID
      const quizId = IdGenerator.generateId()

      // Prepare quiz data
      quizData.quizId = quizId
      quizData.participantA = playerA
      quizData.participantB = playerB
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

      // Initialize the quiz
      const quiz = await quizServices.initQuiz(quizData)
      if (!quiz) {
        throw new CustomError.BadRequestError('Failed to start quiz!')
      }

      // Create the quiz room for further interactions (e.g., score updates, time tracking)
      const participantASocketId = connectedUsers[playerA._id]
      const participantBSocketId = connectedUsers[playerB._id]

      // Add both players to the quiz room
      if (participantASocketId) {
        io.in(participantASocketId).socketsJoin(quizId) // Player A joins the room
        // Emit an event to Player A that the quiz is starting
        io.to(participantASocketId).emit('quiz-1v1-start', {
          // quizId,
          status: 'ready',
          message: 'Game is starting!'
        })
      }
      if (participantBSocketId) {
        io.in(participantBSocketId).socketsJoin(quizId) // Player B joins the room
      }

      // Mark both players as active and remove them from the queue
      activePlayers.delete(playerAId)
      activePlayers.delete(playerBId)

      // Send response to the client to confirm the quiz has started
      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        status: 'success',
        message: 'One vs One quiz started successfully!',
        data: quiz
      })
    }
  } else {
    // If no pair found yet, let the player know they are in the queue
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'You are in the queue, waiting for an opponent!'
    })
  }
}

// Optionally handle player disconnection or leave-queue event
// A function to handle player disconnection and cleanup
const handlePlayerDisconnect = (userId) => {
  // Remove from the queue if present
  queue = queue.filter((id) => id !== userId)
  activePlayers.delete(userId)
}

export default {
  initQuiz,
  initQuizOneVsOne,
  handlePlayerDisconnect
}
