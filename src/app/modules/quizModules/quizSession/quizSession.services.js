import QuizSession from './quizSession.model.js'

// service for create quiz session
const createQuizSession = async (data) => {
  return await QuizSession.create(data)
}

// service for get quiz session by quizId and opponentId
const getQuizSessionByQuizIdAndOpponentId = async (quizId, opponentId) => {
  return await QuizSession.findOne({
    quizId: quizId,
    participantId: opponentId
  })
}

export default {
  createQuizSession,
  getQuizSessionByQuizIdAndOpponentId
}
