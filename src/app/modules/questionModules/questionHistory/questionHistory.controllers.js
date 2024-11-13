import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../../shared/sendResponse.js";
import CustomError from "../../../errors/index.js";
import questionHistoryServices from "./questionHistory.services.js";

// Controller to get question history by userId
const getQuestionHistoryByUserId = async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new CustomError.BadRequestError('Missing userId in request params!');
    }
  
    const questionHistory = await questionHistoryServices.getQuestionHistoryByUserId(userId);
  
    if (!questionHistory) {
      throw new CustomError.NotFoundError('No question history found for this user!');
    }
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Question history retrieved successfull!',
      data: questionHistory,
    });
  };


  export default {
    getQuestionHistoryByUserId,
  }