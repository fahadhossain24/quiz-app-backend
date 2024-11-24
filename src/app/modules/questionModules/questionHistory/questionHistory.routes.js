import express from "express";
import questionHistoryControllers from "./questionHistory.controllers.js";
import authorization from "../../../middlewares/authorization.js";


const questionHistoryRouter = express.Router();

questionHistoryRouter.get('/retrive/:userId', authorization('user'), questionHistoryControllers.getQuestionHistoryByUserId)

export default questionHistoryRouter