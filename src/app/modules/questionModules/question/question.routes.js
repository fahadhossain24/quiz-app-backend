import express from "express";
import questionControllers from "./question.controllers.js";
import requestValidator from "../../../middlewares/requestValidator.js";
import QuestionValidationZodSchema from "./question.validation.js";
import authorization from "../../../middlewares/authorization.js";


const questionRouter = express.Router();

questionRouter.post('/create', authorization('admin'), requestValidator(QuestionValidationZodSchema.createQuestionZodSchema), questionControllers.createQuestion);
questionRouter.get('/retrive/:id', authorization('admin', 'user'), questionControllers.getSpecificQuestion);
questionRouter.get('/all', authorization('admin'), questionControllers.getAllQuestion);
questionRouter.get('/search', authorization('admin'), questionControllers.searchQuestions);
questionRouter.patch('/update/:id', authorization('admin'), requestValidator(QuestionValidationZodSchema.getSpecificQuestionZodSchema), questionControllers.updateSpecificQuestion)
questionRouter.delete('/delete/:id', authorization('admin'), requestValidator(QuestionValidationZodSchema.getSpecificQuestionZodSchema), questionControllers.deleteSpecificQuestion)

export default questionRouter