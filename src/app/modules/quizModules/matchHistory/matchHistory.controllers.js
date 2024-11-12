import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../shared/sendResponse.js";
import CustomError from "../../../errors/index.js";
import matchHistoryServices from "./matchHistory.services.js"

// controllers for get recent match history by user id
const getRecentMatchHistoryByUserId = async(req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new CustomError.BadRequestError("Missing userId in request params!")
    }
    const recentMatchHistories = await matchHistoryServices.recentMatchHistoryByUserId(userId);
    if(!recentMatchHistories.length === 0){
        throw new CustomError.BadRequestError("No match found!")
    }

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        status: 'success',
        message: 'Matches retrive successfull!',
        data: recentMatchHistories,
      })
}


export default {
    getRecentMatchHistoryByUserId,
}