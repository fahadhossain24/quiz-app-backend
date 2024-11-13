import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse.js";
import leaderboardServices from "./leaderboard.services.js";

// controllers for retrive leaderboard based on period (weekly/monthly)
const getLeaderboardsByPeriod = async (req, res) => {
    const { period } = req.query; 
  
    const leaderboard = await leaderboardServices.getLeaderboardsByPeriod(period);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Leaderboard retrieved successfull!',
      data: leaderboard,
    });
  };

  export default  {
    getLeaderboardsByPeriod
  }