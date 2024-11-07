import express from "express";
import questionControllers from "./question.controllers.js";


const questionRouter = express.Router();

questionRouter.post('/create', questionControllers.createQuestion);
questionRouter.get('/all', questionControllers.getAllQuestion);
questionRouter.patch('/update/:id', questionControllers.updateSpecificQuestion)
questionRouter.delete('/delete/:id', questionControllers.deleteSpecificQuestion)

export default questionRouter