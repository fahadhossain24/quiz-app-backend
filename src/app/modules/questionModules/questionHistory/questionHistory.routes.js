import express from "express";
import questionHistoryControllers from "./questionHistory.controllers.js";


const questionHistoryRouter = express.Router();

questionHistoryRouter.get('/retrive/:userId', questionHistoryControllers.getQuestionHistoryByUserId)

export default questionHistoryRouter