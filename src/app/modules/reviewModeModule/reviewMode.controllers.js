import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import reviewModeServices from './reviewMode.services.js'
import CustomError from '../../errors/index.js'
import questionHistoryServices from '../questionModules/questionHistory/questionHistory.services.js'

// controllers for retrive review mode questions based on condition (new/due)
const getReviewModeQuestionsByCondition = async (req, res) => {
  const { condition } = req.query
  const { userId } = req.params

  // Ensure the condition is valid
  const validConditions = ['new', 'due']
  if (!validConditions.includes(condition)) {
    throw new Error(`Invalid condition. Valid conditions are: ${validConditions.join(', ')}`)
  }

  const reviewModeQuestions = await reviewModeServices.getReviewModeQuestionsByUserId(userId, condition)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review mode questions retrieved successfull!',
    data: reviewModeQuestions
  })
}

// controller for add question to review mode for specific user
const addQuestionToReviewModeByUser = async (req, res) => {
  const questionData = req.body
  const reviewMode = await reviewModeServices.getReviewModeByUserId(questionData.userId)
  if (!reviewMode) {
    throw new CustomError.BadRequestError('Invalid userId. No review mode found with the userId!')
  }

  const existQuestionOnReviewMode = reviewMode.questions.some((q) => q._mainId.toString(), questionData.question._mainId)
  if (existQuestionOnReviewMode) {
    throw new CustomError.BadRequestError('The question is already exist on review mode!')
  }

  reviewMode.questions.push(questionData.question)
  await reviewMode.save()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review mode question added successfull!',
    data: reviewMode
  })
}

// controller for update specific review question after submit
const updateReviewQuestionAfterSubmit = async (req, res) => {
  const { userId, questionId, isCurrect, performAnswer } = req.body
  const reviewMode = await reviewModeServices.getReviewModeByUserId(userId)
  if (!reviewMode) {
    throw new CustomError.BadRequestError('Invalid userId!')
  }

  const question = reviewMode.questions.find((q) => q._mainId.toString() === questionId)
  if (!question) {
    throw new CustomError.BadRequestError('Question not found!')
  }

  // Retrieve effective interval settings (user-specific or admin-defined)
  const intervals = await reviewModeServices.getEffectiveIntervals(userId)

  if (isCurrect) {
    question.intervalCount += 1
    // change question isCurrect status in question history if it overcome 7 times currect of 7 intervals
    if (question.intervalCount > intervals.length) {
      const questionHistoryByTheUser = questionHistoryServices.getQuestionHistoryByUser(userId)
      const questionOfQuestionHistory = questionHistoryByTheUser.questions.find((q) => q._mainId.toString() === questionId)
      questionOfQuestionHistory.isCorrect = true
      questionHistoryByTheUser.save() // update question history asyncronusly
      // reviewMode.questions = reviewMode.questions.filter((q) => q._mainId.toString() !== questionId)
    } else {
      question.nextAvailableDate = new Date(Date.now() + intervals[question.intervalCount - 1] * 24 * 60 * 60 * 1000)
      question.sleep = true
      question.condition = 'due'
    }
  } else {
    // Reset to the first interval
    question.intervalCount = 1
    question.nextAvailableDate = new Date(Date.now() + intervals[0] * 24 * 60 * 60 * 1000)
    question.sleep = true
    question.performAnswer = performAnswer
    question.condition = 'due'
  }

  reviewMode.save() // save reviewMode in asyncronusly

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review question submit successfull!'
  })
}

// controller for update user intervals
const updateUserIntervals = async (req, res) => {
  const { userId } = req.params
  const { intervals } = req.body
  if (!Array.isArray(intervals) || intervals.some((interval) => interval <= 0)) {
    throw new CustomError.BadRequestError(
      'Invalid intervals. Provide full array of intervals in day extention. Ex. intervals: [1, 3, 7, 14, 20, 25, 30]'
    )
  }

  const updatedIntervals = await reviewModeServices.updateUserIntervals(userId, intervals)
  if (!updatedIntervals.isModified) {
    throw new CustomError.BadRequestError('Failed to udpate intervals!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review mode intervals settings successfull!'
  })
}

// controller for update admin intervals
const updateAdminIntervals = async (req, res) => {
  const { intervals } = req.body
  if (!Array.isArray(intervals) || intervals.some((interval) => interval <= 0)) {
    throw new CustomError.BadRequestError(
      'Invalid intervals. Provide full array of intervals in day extention. Ex. intervals: [1, 3, 7, 14, 20, 25, 30]'
    )
  }

  const updatedIntervals = await reviewModeServices.updateAdminIntervals(intervals)
  if (!updatedIntervals.isModified) {
    throw new CustomError.BadRequestError('Failed to udpate intervals!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review mode intervals settings successfull!'
  })
}

// controller for retrive global interval settings
const getGlobalIntervals = async (req, res) => {
  const intervals = await reviewModeServices.getAdminIntervals()

  if (!intervals) {
    throw new CustomError.BadRequestError('Interval not found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Review mode intervals retrive successfull!',
    data: intervals
  })
}

export default {
  getReviewModeQuestionsByCondition,
  addQuestionToReviewModeByUser,
  updateReviewQuestionAfterSubmit,
  updateUserIntervals,
  updateAdminIntervals,
  getGlobalIntervals
}
