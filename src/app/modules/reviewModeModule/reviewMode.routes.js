import express from "express";
import reviewModeControllers from "./reviewMode.controllers.js";
import authorization from "../../middlewares/authorization.js";

const reviewModeRouter = express.Router();

reviewModeRouter.get('/questions/retrive/:userId', authorization('user'), reviewModeControllers.getReviewModeQuestionsByCondition)
reviewModeRouter.post('/question/add', authorization('user'), reviewModeControllers.addQuestionToReviewModeByUser)
reviewModeRouter.post('/question/submit', authorization('user'), reviewModeControllers.updateReviewQuestionAfterSubmit)
reviewModeRouter.patch('/settings/intervals/user/:userId', authorization('user'), reviewModeControllers.updateUserIntervals)
reviewModeRouter.patch('/settings/admin/intervals', authorization('admin'), reviewModeControllers.updateAdminIntervals)
reviewModeRouter.get('/admin/intervals', authorization('user', 'admin'), reviewModeControllers.getGlobalIntervals)
reviewModeRouter.get('/user/intervals/:userId', authorization('user', 'admin'), reviewModeControllers.retriveUserIntervals)
// reviewModeRouter.get('/ge', (req, res) => console.log('hello'))

export default reviewModeRouter