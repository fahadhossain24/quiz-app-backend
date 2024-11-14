import express from "express";
import quizControllers from "./quiz.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuizValidationZodSchema from "./quiz.validation.js";

const quizRouter = express.Router();

quizRouter.post('/init-quiz/play-friend', requestValidator(QuizValidationZodSchema.startQuizZodSchema), quizControllers.initQuiz)
quizRouter.post('/init-quiz/one-vs-one', requestValidator(QuizValidationZodSchema.startQuizOneVsOneZodSchema),  quizControllers.initQuizOneVsOne)

export default quizRouter;