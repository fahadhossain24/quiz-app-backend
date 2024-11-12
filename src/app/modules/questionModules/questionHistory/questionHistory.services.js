import QuestionHistory from "./questionHistory.model.js"

// service for get question history by user id
const getQuestionHistoryByUser = async(userId) => {
    return await QuestionHistory.findOne({userId})
}


export default {
    getQuestionHistoryByUser,
}