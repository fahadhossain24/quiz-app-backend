import Question from './question.model.js'

// service to make a question
const createQuestion = async (data) => {
  return await Question.create(data)
}

// service for get specific question
const getSpecificQuestion = async (id) => {
  // console.log(id)
  return await Question.findOne({ _id: id })
}

// service for get random 8 question
const getRandomQuestion = async (number) => {
  return await Question.aggregate([
    {
      $sample: { size: number }
    }
  ])
}

// service to get all question
const getAllQuestion = async (skip, limit) => {
  return await Question.find().skip(skip).limit(limit)
}

// service for update specific question
const updateSpecificQuestion = async (id, data) => {
  return await Question.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service for delete specific question
const deleteSpecificQuestion = async (id) => {
  return await Question.deleteOne({ _id: id })
}

// service for get Question Count
const getQuestionCount = async () => {
  return (await Question.find()).length
}

export default {
  createQuestion,
  getSpecificQuestion,
  getRandomQuestion,
  getAllQuestion,
  updateSpecificQuestion,
  deleteSpecificQuestion,
  getQuestionCount
}
