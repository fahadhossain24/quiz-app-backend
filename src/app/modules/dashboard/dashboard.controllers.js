import { StatusCodes } from "http-status-codes"
import sendResponse from "../../../shared/sendResponse.js"
import Quiz from "../quizModules/quiz/quiz.model.js"
import User from "../userModule/user.model.js"

const getDashboardMetrics = async (req, res) => {
  // Fetch total number of users
  const totalUsers = await User.countDocuments()

  // Fetch total number of quizzes
  const totalQuizzes = await Quiz.countDocuments()

  // Fetch user overview (e.g., monthly user registrations for the past year)
  const userOverview = await User.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])

  // Fetch quiz overview (e.g., monthly quiz creation for the past year)
  const quizOverview = await Quiz.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
console.log(userOverview, quizOverview)
  // Format data for the line chart
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const formatOverviewData = (overview) => {
    const data = new Array(12).fill(0) // Initialize with zeros for all months
    overview.forEach(({ _id, count }) => {
      data[_id - 1] = count // Map month index (0-based)
    })
    return data.map((count) => ((count / totalUsers) * 100).toFixed(2)) // Convert to percentage
  }

  const userChartData = formatOverviewData(userOverview)
  const quizChartData = formatOverviewData(quizOverview)

  // Construct the response data
  const responseData = {
    totalUsers,
    totalQuizzes,
    chartData: {
      xAxis: months,
      userChartData,
      quizChartData
    }
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Dashboard metrics retrieved successfully!',
    data: responseData
  })
}

export default { getDashboardMetrics }
