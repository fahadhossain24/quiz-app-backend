import Quiz from "./quiz.model.js"

// service for start new quiz
const initQuiz = async(data) => {
    return await Quiz.create(data);
}

// service for get specific quiz
const getQuizById = async(id) => {
    return await Quiz.findOne({_id: id});
}


export default {
    initQuiz,
    getQuizById,
}