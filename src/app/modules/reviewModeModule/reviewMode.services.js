import AdminInterval from './adminInterval.mode.js'
import ReviewMode from './reviewMode.model.js'
import mongoose from 'mongoose'

// service for retrive revewMode by userId
const getReviewModeByUserId = async (userId) => {
  return await ReviewMode.findOne({ userId })
}

// service for retrive revewMode intervals by userId
const getReviewModeIntervalsByUserId = async (userId) => {
  return await ReviewMode.findOne({ userId }).select('intervalSettings')
}

// service for retrive revewMode questions by userId
const getReviewModeQuestionsByUserId = async (userId, condition) => {
  // Find the reviewMode document for the user and filter by condition
  const reviewMode = await ReviewMode.findOne({ userId }).populate('questions._mainId')

  if (!reviewMode) {
    return []
  }

  // Filter questions based on the condition and sleep status
  const filteredQuestions = reviewMode.questions.filter((question) => question.condition === condition && question.sleep === false)

  return filteredQuestions
}

// service for wake question after complete certain interval
const wakeQuestionsAfterCertainInterval = async () => {
  const now = new Date()

  // Find all questions that need to be woken up
  const reviewModes = await ReviewMode.updateMany(
    { 'questions.sleep': true, 'questions.nextAvailableDate': { $lte: now } },
    { $set: { 'questions.$.sleep': false } }
  )

  return reviewModes
}

// service for update user intervals
const updateUserIntervals = async (userId, intervals) => {
  return await ReviewMode.findOneAndUpdate({userId}, { intervalSettings: intervals }, { new: true })
}

// service for update admin intervals
const updateAdminIntervals = async (intervals) => {
  return await AdminInterval.findOneAndUpdate({}, { intervalSettings: intervals }, { new: true, upsert: true })
}

// service for get admin intervals
const getAdminIntervals = async () => {
  const intervals = await AdminInterval.findOne()
  return intervals
}

// service for get effective intervals for questions by userId
const getEffectiveIntervals = async (userId) => {
  const adminIntervalSettings = await getAdminIntervals()

  const userIntervalSettings = await ReviewMode.findOne({ userId }).select('intervalSettings')
  const userIntervals = userIntervalSettings?.intervalSettings || []

  return userIntervals.length ? userIntervals : adminIntervalSettings
}

export default {
  getReviewModeByUserId,
  getReviewModeIntervalsByUserId,
  getReviewModeQuestionsByUserId,
  wakeQuestionsAfterCertainInterval,
  updateUserIntervals,
  updateAdminIntervals,
  getAdminIntervals,
  getEffectiveIntervals,
}
