import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse.js";
import Quiz from "../quizModules/quiz/quiz.model.js";
import User from "../userModule/user.model.js";
import { DateTime } from "luxon";  // Import Luxon DateTime

// const getDashboardMetrics = async (req, res) => {
//   const { period = "monthly", year = DateTime.now().year } = req.query; // Default to current year

//   // Fetch total number of users
//   const totalUsers = await User.countDocuments();

//   // Fetch total number of quizzes
//   const totalQuizzes = await Quiz.countDocuments();

//   // Helper function to format data for chart (same as before)
//   const formatOverviewData = (overview, total) => {
//     const data = new Array(12).fill(0); // Initialize with zeros for all months
//     overview.forEach(({ _id, count }) => {
//       data[_id - 1] = count; // Map month index (0-based)
//     });
//     return data.map((count) => ((count / total) * 100).toFixed(2)); // Convert to percentage based on total (totalUsers or totalQuizzes)
//   };

//   // Function to get data based on period (daily or monthly)
//   const getAggregatedData = async (model, period, year) => {
//     let matchStage = {};

//     // Filter by year
//     if (year) {
//       matchStage = {
//         $match: {
//           createdAt: {
//             $gte: DateTime.fromObject({ year, month: 1, day: 1 }).toJSDate(), // Start of the year
//             $lt: DateTime.fromObject({ year: parseInt(year) + 1, month: 1, day: 1 }).toJSDate(), // Start of next year
//           },
//         },
//       };
//     }

//     // Aggregate data by period (day or month)
//     let groupStage = {};
//     if (period === "daily") {
//       groupStage = {
//         $group: {
//           _id: { $dayOfWeek: "$createdAt" },  // Group by day of the week (1 = Sunday, 7 = Saturday)
//           count: { $sum: 1 },
//         },
//       };
//     } else if (period === "monthly") {
//       groupStage = {
//         $group: {
//           _id: { $month: "$createdAt" },  // Group by month
//           count: { $sum: 1 },
//         },
//       };
//     }

//     const aggregationPipeline = [
//       matchStage,
//       groupStage,
//       { $sort: { _id: 1 } }, // Sort by period (_id will be month/day)
//     ];

//     return model.aggregate(aggregationPipeline);
//   };

//   // Fetch user overview (e.g., daily or monthly user registrations)
//   const userOverview = await getAggregatedData(User, period, year);

//   // Fetch quiz overview (e.g., daily or monthly quiz creation)
//   const quizOverview = await getAggregatedData(Quiz, period, year);

//   // console.log("User Overview:", userOverview);
//   // console.log("Quiz Overview:", quizOverview);

//   // Define dynamic x-axis based on the period
//   let xAxis;
//   if (period === "daily") {
//     xAxis = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   } else if (period === "monthly") {
//     xAxis = [
//       "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
//     ];
//   }

//   // Format the overview data
//   const userChartData = formatOverviewData(userOverview, totalUsers);
//   const quizChartData = formatOverviewData(quizOverview, totalQuizzes);

//   // Construct the response data
//   const responseData = {
//     totalUsers,
//     totalQuizzes,
//     chartData: {
//       xAxis,
//       userChartData,
//       quizChartData,
//     },
//   };

//   // Send the response
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: "success",
//     message: "Dashboard metrics retrieved successfully!",
//     data: responseData,
//   });
// };

const getDashboardMetrics = async (req, res) => {
  const { period = "monthly", year = DateTime.now().year } = req.query; // Default to current year

  // Fetch total number of users
  const totalUsers = await User.countDocuments();

  // Fetch total number of quizzes
  const totalQuizzes = await Quiz.countDocuments();

  // Helper function to format data for chart (percentage-based)
  const formatOverviewData = (overview, total) => {
    const data = new Array(12).fill(0); // Initialize with zeros for all months
    overview.forEach(({ _id, count }) => {
      data[_id - 1] = count; // Map month index (0-based)
    });
    return data.map((count) => ((count / total) * 100).toFixed(2)); // Convert to percentage based on total (totalUsers or totalQuizzes)
  };

  // Function to get data based on period (daily or monthly)
  const getAggregatedData = async (model, period, year) => {
    let matchStage = {};

    // Filter by year
    if (year) {
      matchStage = {
        $match: {
          createdAt: {
            $gte: DateTime.fromObject({ year, month: 1, day: 1 }).toJSDate(), // Start of the year
            $lt: DateTime.fromObject({ year: parseInt(year) + 1, month: 1, day: 1 }).toJSDate(), // Start of next year
          },
        },
      };
    }

    // Aggregate data by period (day or month)
    let groupStage = {};
    if (period === "daily") {
      groupStage = {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },  // Group by day of the week (1 = Sunday, 7 = Saturday)
          count: { $sum: 1 },
        },
      };
    } else if (period === "monthly") {
      groupStage = {
        $group: {
          _id: { $month: "$createdAt" },  // Group by month
          count: { $sum: 1 },
        },
      };
    }

    const aggregationPipeline = [
      matchStage,
      groupStage,
      { $sort: { _id: 1 } }, // Sort by period (_id will be month/day)
    ];

    return model.aggregate(aggregationPipeline);
  };

  // Function to get active users (direct count, no percentage)
  const getActiveUsersAggregatedData = async (period, year) => {
    let matchStage = {};

    // Filter by year
    if (year) {
      matchStage = {
        $match: {
          createdAt: {
            $gte: DateTime.fromObject({ year, month: 1, day: 1 }).toJSDate(), // Start of the year
            $lt: DateTime.fromObject({ year: parseInt(year) + 1, month: 1, day: 1 }).toJSDate(), // Start of next year
          },
        },
      };
    }

    // Aggregate active users by period (day or month)
    let groupStage = {};
    if (period === "daily") {
      groupStage = {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },  // Group by day of the week (1 = Sunday, 7 = Saturday)
          activeUsers: { $addToSet: "$participantA._id" },  // Get distinct active users for participantA
        },
      };
    } else if (period === "monthly") {
      groupStage = {
        $group: {
          _id: { $month: "$createdAt" },  // Group by month
          activeUsers: { $addToSet: "$participantA._id" },  // Get distinct active users for participantA
        },
      };
    }

    const aggregationPipeline = [
      matchStage,
      groupStage,
      { $sort: { _id: 1 } }, // Sort by period (_id will be month/day)
    ];

    return Quiz.aggregate(aggregationPipeline);
  };

  // Fetch active users overview (e.g., daily or monthly)
  const activeUsersOverview = await getActiveUsersAggregatedData(period, year);

  // Fetch quiz overview (e.g., daily or monthly quiz creation)
  const quizOverview = await getAggregatedData(Quiz, period, year);

  // Define dynamic x-axis based on the period
  let xAxis;
  if (period === "daily") {
    xAxis = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  } else if (period === "monthly") {
    xAxis = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
    ];
  }

  // Format the active users data (direct count)
  const activeUserChartData = activeUsersOverview.map((item) => item.activeUsers.length); // Number of distinct active users

  // Format the quiz data (percentage-based)
  const quizChartData = formatOverviewData(quizOverview, totalQuizzes);

  // Construct the response data
  const responseData = {
    totalUsers,
    totalQuizzes,
    chartData: {
      xAxis,
      activeUserChartData,  // Active users count per period (direct value)
      quizChartData,        // Quizzes count per period (percentage)
    },
  };

  // Send the response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: "success",
    message: "Dashboard metrics retrieved successfully!",
    data: responseData,
  });
};





export default { getDashboardMetrics };
