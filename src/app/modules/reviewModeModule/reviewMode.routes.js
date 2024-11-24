import express from "express";
import reviewModeControllers from "./reviewMode.controllers.js";

const reviewModeRouter = express.Router();

reviewModeRouter.get('/questions/retrive/:userId', reviewModeControllers.getReviewModeQuestionsByCondition)
reviewModeRouter.post('/question/add', reviewModeControllers.addQuestionToReviewModeByUser)
reviewModeRouter.post('/question/submit', reviewModeControllers.updateReviewQuestionAfterSubmit)
reviewModeRouter.patch('/settings/intervals/user/:userId', reviewModeControllers.updateUserIntervals)
reviewModeRouter.patch('/settings/admin/intervals', reviewModeControllers.updateAdminIntervals)
reviewModeRouter.get('/admin/intervals', reviewModeControllers.getGlobalIntervals)
reviewModeRouter.get('/user/intervals/:userId', reviewModeControllers.retriveUserIntervals)
// reviewModeRouter.get('/ge', (req, res) => console.log('hello'))

export default reviewModeRouter