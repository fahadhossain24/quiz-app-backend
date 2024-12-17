import QuestionHistory from './questionHistory.model.js'

// service for get question history by user id
const getQuestionHistoryByUser = async (userId) => {
  return await QuestionHistory.findOne({ userId })
}

// Service to retrieve question history by userId
// const getQuestionHistoryByUserId = async (userId) => {
//   return await QuestionHistory.findOne({ userId }).populate('questions._mainId').exec()
// }
const getQuestionHistoryByUserId = async (userId) => {
  return await QuestionHistory.findOne({ userId })
    .populate({
      path: 'questions._mainId', // Populate _mainId (the question document)
      populate: [
        { path: 'speciality' }, // Populate speciality inside the question
        { path: 'condition' },   // Populate condition inside the question
      ]
    })
    .exec();
}


export default {
  getQuestionHistoryByUser,
  getQuestionHistoryByUserId
}
