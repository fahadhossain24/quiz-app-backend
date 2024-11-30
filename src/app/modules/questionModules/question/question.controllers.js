import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../../shared/sendResponse.js'
import CustomError from '../../../errors/index.js'
import questionServices from './question.services.js'
import IdGenerator from '../../../../utils/idGenerator.js'
import { shuffleQuestionOptions } from './question.utils.js'

// controller for make new question
const createQuestion = async (req, res) => {
  const questionData = req.body

  const questionId = IdGenerator.generateId()
  questionData.questionId = questionId

  // Ensure that 'optionA' is set before shuffling
  if (!questionData.options.optionA && questionData.options.answer) {
    questionData.options.optionA = questionData.options.answer
  }

  const question = await questionServices.createQuestion(questionData)

  if (!question) {
    throw new CustomError.BadRequestError('Failed to make new question!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New question added successfully!',
    data: question
  })
}

// controller for get all questions
const getSpecificQuestion = async (req, res) => {
  const {id} = req.params

  const question = await questionServices.getSpecificQuestion(id)

  if (!question) {
    throw new CustomError.BadRequestError('Question not found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Question retrive successfull.',
    data: question
  })
}

// controller for get all questions
const getAllQuestion = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 9
  const speciality = req.query.speciality

  // Calculate the starting index for pagination
  const skip = (page - 1) * limit
  const questions = await questionServices.getAllQuestion(speciality, skip, limit)

  // if (questions.length === 0) {
  //   throw new CustomError.BadRequestError('No questions ware found!')
  // }

  const totalQuestions = await questionServices.getQuestionCount()
  const totalPages = Math.ceil(totalQuestions / limit)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Questions retrive successfull',
    meta: {
      totalQuestions,
      totalPages,
      currentPage: page,
      pageSize: limit
    },
    data: questions
  })
}

// controller for update specific question
const updateSpecificQuestion = async (req, res) => {
  const { id } = req.params
  const questionData = req.body

  const question = await questionServices.getSpecificQuestion(id)
  if (!question) {
    throw new CustomError.BadRequestError('Question not found!')
  }

  // Ensure that 'optionA' is set before shuffling
  if (!questionData.options.optionA && questionData.options.answer) {
    questionData.options.optionA = questionData.options.answer
  }

  // Shuffle the options
  questionData.options = shuffleQuestionOptions(questionData.options)

  const updatedQuestion = await questionServices.updateSpecificQuestion(id, questionData)

  if (!updatedQuestion.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to modify the question!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Question modification successfull'
  })
}

// controller for delete specific question
const deleteSpecificQuestion = async (req, res) => {
  const { id } = req.params
  const deletedQuestion = await questionServices.deleteSpecificQuestion(id)

  if (!deletedQuestion.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete the question!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Question deletetion successfull'
  })
}

// controller for search question
const searchQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 9
  const {query} = req.query

  // Calculate the starting index for pagination
  const skip = (page - 1) * limit
  const questions = await questionServices.getSearchQuestion(query, skip, limit)

  // if (questions.length === 0) {
  //   throw new CustomError.BadRequestError('No questions ware found!')
  // }

  const totalSearchResult = questions.length || 0
  const totalPages = Math.ceil(totalSearchResult / limit)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Search perform successfull',
    meta: {
      totalSearchResult,
      totalPages,
      currentPage: page,
      pageSize: limit
    },
    data: questions
  })
}

export default {
  createQuestion,
  getSpecificQuestion,
  getAllQuestion,
  searchQuestions,
  updateSpecificQuestion,
  deleteSpecificQuestion
}
