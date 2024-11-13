import express from "express";
import quizControllers from "./quiz.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuizValidationZodSchema from "./quiz.validation.js";

const quizRouter = express.Router();

quizRouter.post('/start-quiz/play-friend', requestValidator(QuizValidationZodSchema.startQuizZodSchema), quizControllers.startQuiz)
quizRouter.post('/start-quiz/one-vs-one', requestValidator(QuizValidationZodSchema.startQuizOneVsOneZodSchema),  quizControllers.startQuizOneVsOne)

export default quizRouter;