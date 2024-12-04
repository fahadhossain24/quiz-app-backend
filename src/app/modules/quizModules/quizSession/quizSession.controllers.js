import { StatusCodes } from 'http-status-codes'
import config from '../../../../config/index.js'
import calculateEloXP from '../../../../utils/calculateEloXP.js'
import CustomError from '../../../errors/index.js'
import leaderboardServices from '../../leaderboardModule/leaderboard.services.js'
import QuestionHistory from '../../questionModules/questionHistory/questionHistory.model.js'
import questionHistoryServices from '../../questionModules/questionHistory/questionHistory.services.js'
import quizServices from '../quiz/quiz.services.js'
import quizSessionServices from './quizSession.services.js'
import sendResponse from '../../../../shared/sendResponse.js'
import userServices from '../../userModule/user.services.js'
import matchHistoryServices from '../matchHistory/matchHistory.services.js'
import friendServices from '../../friendModule/friend.services.js'
import reviewModeServices from '../../reviewModeModule/reviewMode.services.js'
import ReviewMode from '../../reviewModeModule/reviewMode.model.js'
import { io, connectedUsers } from '../../../../server.js'

// controllers for create quiz session
const createQuizSession = async (req, res) => {
  const quizSessionData = req.body

  // .........................Fetch the quiz data to identify participants......................
  const quiz = await quizServices.getQuizById(quizSessionData._quizId)
  quizSessionData.quizId = quiz._id

  if (!quiz) {
    throw new CustomError.BadRequestError('No quiz found!')
  }

  // ...................Determine opponent ID based on the current participant...................
  const opponentId = quiz.participantA._id.toString() === quizSessionData.participantId.toString() ? quiz.participantB._id : quiz.participantA._id

  // ......................Create current participant's quiz session..............................
  const playerQuizSession = await quizSessionServices.createQuizSession(quizSessionData)

  // ..................retrieve the opponent's quiz session, if it exists..........................
  const opponentQuizSession = await quizSessionServices.getQuizSessionByQuizIdAndOpponentId(quizSessionData.quizId, opponentId)

  // If the opponent's session doesn't exist, respond with pending status
  if (!opponentQuizSession) {
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'pending',
      message: 'Waiting for opponent submission.',
      data: { result: 'pending' }
    })
  }

  if (playerQuizSession.score <= 0 && opponentQuizSession.score <= 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'Warning',
      message: 'Quizover! Play again'
    })
  }

  // .....................Determine result for the current player and opponent based on scores.............................
  const playerQuizResult = playerQuizSession.score > opponentQuizSession.score ? 'win' : 'loss'
  const opponentQuizResult = opponentQuizSession.score > playerQuizSession.score ? 'win' : 'loss'

  // ........................calculate xp and update xp on player/opponent and udate leaderboard by rank.....................
  // Fetch or create leaderboard entries for both participants
  const playerLeaderboard = await leaderboardServices.getOrCreateLeaderboardOfAUser(playerQuizSession.participantId)
  const opponentLeaderboard = await leaderboardServices.getOrCreateLeaderboardOfAUser(opponentQuizSession.participantId)
  // console.log(playerLeaderboard, opponentLeaderboard)

  // ........................................Calculate new XP using Elo rating system........................................
  const { newXP: playerNewXP, xpChange: playerGameXP } = calculateEloXP(
    playerLeaderboard.xp,
    opponentLeaderboard.xp,
    playerQuizResult,
    Number(config.xp_calculation_kfactor)
  )
  const { newXP: opponentNewXP, xpChange: opponentGameXP } = calculateEloXP(
    opponentLeaderboard.xp,
    playerLeaderboard.xp,
    opponentQuizResult,
    Number(config.xp_calculation_kfactor)
  )
  // console.log(playerNewXP, opponentNewXP)
  const matchDate = new Date()
  const opponentMatchDate = new Date()

  // only make effect on xp and leaderboard for oneVsOne game
  if (quizSessionData.isOneVsOne) {
    // ........................................Update leaderboard with new XP for player........................................
    await leaderboardServices.updateLeaderboardXPByUser(quizSessionData.participantId, playerNewXP)
    await leaderboardServices.updateLeaderboardXPByUser(opponentQuizSession.participantId, opponentNewXP)

    // Update leaderboard ranks asynchronously to avoid blocking response
    leaderboardServices.updateLeaderboardRank()

    // ..........................................update user(player/opponent) xp and rank........................................
    // player
    const user = await userServices.getSpecificUser(quizSessionData.participantId)

    // retrive leaderboard by perticipantId
    const leaderboardByUser = await leaderboardServices.getLeaderboardByUserId(quizSessionData.participantId)

    // udpate user by her xp and rank
    if (user) {
      user.xp = leaderboardByUser.xp
      user.rank = leaderboardByUser.rank
      user.date = matchDate
      await user.save()
    }

    // opponent
    const opponent = await userServices.getSpecificUser(opponentQuizSession.participantId)

    // retrive leaderboard by opponentId
    const leaderboardByOpponent = await leaderboardServices.getLeaderboardByUserId(opponentQuizSession.participantId)

    // udpate opponent by her xp and rank
    if (opponent) {
      opponent.xp = leaderboardByOpponent.xp
      opponent.rank = leaderboardByOpponent.rank
      opponent.date = opponentMatchDate
      await opponent.save()
    }
  }

  // ..................................Track match history for the player..........................
  await matchHistoryServices.updateMatchHistory(quizSessionData.participantId, opponentId, playerQuizResult, playerNewXP)
  await matchHistoryServices.updateMatchHistory(opponentId, quizSessionData.participantId, opponentQuizResult, opponentNewXP)

  // ....................make friend or update existing friend playing time.........................
  await friendServices.updateFriend(quizSessionData.participantId, opponentId, matchDate)
  await friendServices.updateFriend(opponentId, quizSessionData.participantId, opponentMatchDate)

  // .................................transfer failed question into review mode...............................
  // player
  const failedQuestions = quizSessionData.failedQuestions.map((failed) => ({
    _mainId: failed._mainId,
    questionId: failed.questionId,
    isCurrect: false,
    performAnswer: failed.performAnswer,
    intervalCount: 1,
    sleep: false
  }))

  let reviewMode = await reviewModeServices.getReviewModeByUserId(quizSessionData.participantId)

  if (reviewMode) {
    failedQuestions.forEach((failedQuestion) => {
      const exists = reviewMode.questions.some((q) => q._mainId.toString() === failedQuestion._mainId.toString())

      if (!exists) {
        failedQuestion.condition = 'new'
        reviewMode.questions.push(failedQuestion)
      }
    })
    await reviewMode.save()
  } else {
    reviewMode = new ReviewMode({
      userId: quizSessionData.participantId,
      questions: failedQuestions
    })
    await reviewMode.save()
  }

  // opponent
  const failedQuestionsOfOpponent = opponentQuizSession.failedQuestions.map((failed) => ({
    _mainId: failed._mainId,
    questionId: failed.questionId,
    isCurrect: false,
    performAnswer: failed.performAnswer,
    intervalCount: 1,
    sleep: false
  }))

  let opponentReviewMode = await reviewModeServices.getReviewModeByUserId(opponentId)

  if (opponentReviewMode) {
    failedQuestionsOfOpponent.forEach((failedQuestion) => {
      const exists = opponentReviewMode.questions.some((q) => q._mainId.toString() === failedQuestion._mainId.toString())

      if (!exists) {
        failedQuestion.condition = 'new'
        opponentReviewMode.questions.push(failedQuestion)
      }
    })
    await opponentReviewMode.save()
  } else {
    opponentReviewMode = new ReviewMode({
      userId: opponentQuizSession.participantId,
      questions: failedQuestionsOfOpponent
    })
    await opponentReviewMode.save()
  }

  // .................................transerfer questions into question history.......................................
  // player
  // Prepare failed questions map to track incorrectly answered questions
  const failedQuestionsMap = new Map(
    quizSessionData.failedQuestions.map((failed) => [String(failed._mainId), { _mainId: failed._mainId, performAnswer: failed.performAnswer }])
  )
  // console.log("Failed question map", failedQuestionsMap)

  // Map through quiz questions and mark correct/incorrect responses
  const questionsOfTheQuiz = quiz.questions.map((question) => {
    const failedQuestion = failedQuestionsMap.get(String(question._mainId))
    return {
      _mainId: question._mainId,
      questionId: question.questionId,
      isCurrect: !failedQuestion,
      performAnswer: failedQuestion ? failedQuestion.performAnswer : null
    }
  })
  // console.log("Questions of the quiz", questionsOfTheQuiz)

  // Save or update question history for the participant
  let questionHistoryByParticipant = await questionHistoryServices.getQuestionHistoryByUser(quizSessionData.participantId)
  if (questionHistoryByParticipant) {
    questionsOfTheQuiz.forEach((newQuestion) => {
      const existingQuestion = questionHistoryByParticipant.questions.find((q) => q._mainId.toString() === newQuestion._mainId.toString())

      if (existingQuestion) {
        existingQuestion.isCurrect = newQuestion.isCurrect
        existingQuestion.performAnswer = newQuestion.performAnswer
      } else {
        questionHistoryByParticipant.questions.push(newQuestion)
      }
    })
    await questionHistoryByParticipant.save()
  } else {
    questionHistoryByParticipant = new QuestionHistory({
      userId: quizSessionData.participantId,
      questions: questionsOfTheQuiz
    })
    await questionHistoryByParticipant.save()
  }

  // opponent
  // Prepare failed questions map to track incorrectly answered questions
  const failedQuestionsMapOfOpponent = new Map(
    opponentQuizSession.failedQuestions.map((failed) => [String(failed._mainId), { _mainId: failed._mainId, performAnswer: failed.performAnswer }])
  )

  // Map through quiz questions and mark correct/incorrect responses
  const questionsOfTheQuizOfOpponent = quiz.questions.map((question) => {
    const failedQuestion = failedQuestionsMapOfOpponent.get(String(question._mainId))
    return {
      _mainId: question._mainId,
      questionId: question.questionId,
      isCurrect: !failedQuestion,
      performAnswer: failedQuestion ? failedQuestion.performAnswer : null
    }
  })

  // Save or update question history for the participant
  let questionHistoryByOpponent = await questionHistoryServices.getQuestionHistoryByUser(opponentQuizSession.participantId)
  if (questionHistoryByOpponent) {
    questionsOfTheQuizOfOpponent.forEach((newQuestion) => {
      const existingQuestion = questionHistoryByOpponent.questions.find((q) => q._mainId.toString() === newQuestion._mainId.toString())

      if (existingQuestion) {
        existingQuestion.isCurrect = newQuestion.isCurrect
        existingQuestion.performAnswer = newQuestion.performAnswer
      } else {
        questionHistoryByOpponent.questions.push(newQuestion)
      }
    })
    await questionHistoryByOpponent.save()
  } else {
    questionHistoryByOpponent = new QuestionHistory({
      userId: opponentQuizSession.participantId,
      questions: questionsOfTheQuizOfOpponent
    })
    await questionHistoryByOpponent.save()
  }

  // ...............................finally emit opponent result................................
  const opponentSocketId = connectedUsers[opponentId]
  if (opponentSocketId) {
    io.to(opponentSocketId).emit('get-result', {
      result: opponentQuizResult,
      xp: opponentGameXP,
      playerScore: opponentQuizSession.score,
      opponentScore: playerQuizSession.score
    })
  }

  // Send the final response with result and XP data
  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Quiz submission successful!',
    data: {
      result: playerQuizResult,
      xp: playerGameXP,
      playerScore: playerQuizSession.score,
      opponentScore: opponentQuizSession.score
    }
  })
}

export default {
  createQuizSession
}
