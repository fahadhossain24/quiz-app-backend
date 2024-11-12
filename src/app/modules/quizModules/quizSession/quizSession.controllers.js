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

// controllers for create quiz session
const createQuizSession = async (req, res) => {
  const quizSessionData = req.body

  // Fetch the quiz data to identify participants
  const quiz = await quizServices.getQuizById(quizSessionData.quizId)
  if (!quiz) {
    throw new CustomError.BadRequestError('No quiz found!')
  }

  // Determine opponent ID based on the current participant
  const opponentId = quiz.participantA._id.toString() === quizSessionData.participantId.toString() ? quiz.participantB._id : quiz.participantA._id

  // Create or update the current participant's quiz session
  const playerQuizSession = await quizSessionServices.createQuizSession(quizSessionData)

  // Attempt to retrieve the opponent's quiz session, if it exists
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

  // Determine result for the current player based on scores
  const playerQuizResult = playerQuizSession.score > opponentQuizSession.score ? 'win' : 'loss'

  // Fetch or create leaderboard entries for both participants
  const playerLeaderboard = await leaderboardServices.getOrCreateLeaderboardOfAUser(playerQuizSession.participantId)
  const opponentLeaderboard = await leaderboardServices.getOrCreateLeaderboardOfAUser(opponentQuizSession.participantId)

  // Calculate new XP using Elo rating system
  const playerNewXP = calculateEloXP(playerLeaderboard.xp, opponentLeaderboard.xp, playerQuizResult, Number(config.xp_calculation_kfactor))

  // Update leaderboard with new XP for player
  await leaderboardServices.updateLeaderboardXPByUser(quizSessionData.participantId, playerNewXP)

  // Update leaderboard ranks asynchronously to avoid blocking response
  leaderboardServices.updateLeaderboardRank()

  // retrive user by participantId
  const user = await userServices.getSpecificUser(quizSessionData.participantId)

  // retrive leaderboard by perticipantId
  const leaderboardByUser = await leaderboardServices.getLeaderboardByUserId(quizSessionData.participantId)
  const matchDate = new Date()

  // udpate user by her xp and rank
  if (user) {
    user.xp = leaderboardByUser.xp
    user.rank = leaderboardByUser.rank
    user.date = matchDate
    await user.save()
  }

  // Track match history for the player
  await matchHistoryServices.updateMatchHistory(quizSessionData.participantId, opponentId, playerQuizResult, playerNewXP)

  // make friend or update existing friend playing time
  await friendServices.updateFriend(quizSessionData.participantId, opponentId, matchDate)

  // Prepare failed questions map to track incorrectly answered questions
  const failedQuestionsMap = new Map(
    quizSessionData.failedQuestions.map((failed) => [String(failed._mainId), { _mainId: failed._mainId, performAnswer: failed.performAnswer }])
  )

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

  // Send the final response with result and XP data
  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Quiz submission successful!',
    data: {
      result: playerQuizResult,
      xp: playerNewXP
    }
  })
}

export default {
  createQuizSession
}
