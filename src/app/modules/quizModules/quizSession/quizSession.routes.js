import express from "express";
import quizSessionControllers from "./quizSession.controllers.js";
import authorization from "../../../middlewares/authorization.js";

const quizSessionRouter = express.Router();

quizSessionRouter.post('/create', authorization('user'), quizSessionControllers.createQuizSession)

export default quizSessionRouter;