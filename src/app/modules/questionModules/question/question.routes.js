import express from "express";
import questionControllers from "./question.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuestionValidationZodSchema from "./question.validation.js";


const questionRouter = express.Router();

questionRouter.post('/create', requestValidator(QuestionValidationZodSchema.createQuestionZodSchema), questionControllers.createQuestion);
questionRouter.get('/all', questionControllers.getAllQuestion);
questionRouter.patch('/update/:id', requestValidator(QuestionValidationZodSchema.getSpecificQuestionZodSchema), questionControllers.updateSpecificQuestion)
questionRouter.delete('/delete/:id', requestValidator(QuestionValidationZodSchema.getSpecificQuestionZodSchema), questionControllers.deleteSpecificQuestion)

export default questionRouter