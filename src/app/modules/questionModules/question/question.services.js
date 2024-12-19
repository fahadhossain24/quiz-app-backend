import IdGenerator from '../../../../utils/idGenerator.js'
import Question from './question.model.js'

// service to make a question
const createQuestion = async (data) => {
  return await Question.create(data)
}

// service for get specific question
const getSpecificQuestion = async (id) => {
  // console.log(id)
  return await Question.findOne({ _id: id }).populate('speciality').populate('condition')
}

// service for get random 8 question
// const getRandomQuestion = async (number) => {
//   return await Question.aggregate([
//     {
//       $sample: { size: number }
//     }
//   ])
// }
const getRandomQuestion = async (number) => {
  return await Question.aggregate([
    {
      $addFields: {
        weight: {
          $cond: {
            if: { $eq: ['importanceLevel', 5] },
            then: 5,
            else: {
              $cond: {
                if: { $eq: ['importanceLevel', 4] },
                then: 4,
                else: {
                  $cond: {
                    if: { $eq: ['importanceLevel', 3] },
                    then: 3,
                    else: {
                      $cond: {
                        if: { $eq: ['importanceLevel', 2] },
                        then: 2,
                        else: 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      $sample: { size: number }
    },
    {
      $sort: { weight: -1 }
    }
  ])
}

// service to get all question
// const getAllQuestion = async (speciality, skip, limit) => {
//   const filter = speciality ? { speciality } : {}
//   return await Question.find(filter).skip(skip).limit(limit)
// }

// service to get all question
const getAllQuestion = async (query, skip, limit) => {
  let filter = {}

  // If a search query is provided, perform a text search
  if (query) {
    filter = { $text: { $search: query } }
  }

  return await Question.find(filter).skip(skip).limit(limit)
}

// service to get search question
const getSearchQuestion = async (query, skip, limit) => {
  return await Question.find({ $text: { $search: query } })
    .skip(skip)
    .limit(limit)
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

// Service to handle bulk creation of questions
const bulkCreateQuestions = async (questionsData) => {
  // Use for...of to handle async operations sequentially
  for (const question of questionsData) {
    const questionId = IdGenerator.generateId() // Assuming this generates a unique ID for each question

    // Ensure options are provided and handle missing options gracefully
    const options = {
      answer: question['options.answer'],
      optionA: question['options.optionA'],
      optionB: question['options.optionB'],
      optionC: question['options.optionC'],
      optionD: question['options.optionD'],
      optionE: question['options.optionE']
    }

    // Check if any option is missing (if required)
    if (!options.answer || !options.optionA || !options.optionB || !options.optionC || !options.optionD || !options.optionE) {
      console.error('Missing required options fields for question:', question)
      continue // Skip this question and move to the next
    }

    try {
      await Question.insertMany({
        questionId: questionId,
        question: question.question,
        readTime: question.readTime,
        answerTime: question.answerTime || '10s', // Default to '10s' if not provided
        options: options, // Assign the reconstructed options object
        useCount: question.useCount || 0, // Default to 0 if not provided
        speciality: question.speciality,
        importanceLavel: question.importanceLavel || 3, // Default to 3 if not provided
        condition: question.condition,
        explanation: question.explanation || ''
      })
    } catch (err) {
      console.error('Error inserting question:', err)
    }
  }
}

export default {
  createQuestion,
  getSpecificQuestion,
  getRandomQuestion,
  getAllQuestion,
  getSearchQuestion,
  updateSpecificQuestion,
  deleteSpecificQuestion,
  getQuestionCount,
  bulkCreateQuestions
}
