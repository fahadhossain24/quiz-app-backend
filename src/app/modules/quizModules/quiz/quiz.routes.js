import express from "express";
import quizControllers from "./quiz.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuizValidationZodSchema from "./quiz.validation.js";

const quizRouter = express.Router();

quizRouter.post('/start-quiz', requestValidator(QuizValidationZodSchema.startQuizZodSchema), quizControllers.startQuiz)

export default quizRouter;