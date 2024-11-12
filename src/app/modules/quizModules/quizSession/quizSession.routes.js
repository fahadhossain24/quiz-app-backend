import express from "express";
import quizSessionControllers from "./quizSession.controllers.js";

const quizSessionRouter = express.Router();

quizSessionRouter.post('/create', quizSessionControllers.createQuizSession)

export default quizSessionRouter;