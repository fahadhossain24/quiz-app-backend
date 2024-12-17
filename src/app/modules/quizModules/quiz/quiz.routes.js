import express from "express";
import quizControllers from "./quiz.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuizValidationZodSchema from "./quiz.validation.js";
import authorization from "../../../middlewares/authorization.js";

const quizRouter = express.Router();

quizRouter.post('/init-quiz/play-friend', authorization('user'), requestValidator(QuizValidationZodSchema.startQuizZodSchema), quizControllers.initQuiz)
quizRouter.post('/init-quiz/one-vs-one', authorization('user'), requestValidator(QuizValidationZodSchema.startQuizOneVsOneZodSchema),  quizControllers.initQuizOneVsOne)
quizRouter.post('/init-rematch/one-vs-one', authorization('user'), requestValidator(QuizValidationZodSchema.startRematchOneVsOneZodSchema),  quizControllers.initRematchOneVsOne)
quizRouter.post('/back-to-home', authorization('user'), requestValidator(QuizValidationZodSchema.startRematchOneVsOneZodSchema), quizControllers.backToHome)

export default quizRouter;