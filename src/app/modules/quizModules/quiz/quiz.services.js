import Quiz from "./quiz.model.js"

// service for start new quiz
const initQuiz = async(data) => {
    return await Quiz.create(data);
}

// service for get specific quiz
const getQuizById = async(quizId) => {
    // console.log(quizId)
    return await Quiz.findOne({quizId});
}


export default {
    initQuiz,
    getQuizById,
}