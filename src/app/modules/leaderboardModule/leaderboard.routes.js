import express from "express";
import leaderboardControllers from "./leaderboard.controllers.js";
import authorization from "../../middlewares/authorization.js";

const leaderboardRouter = express.Router();

leaderboardRouter.get('/retrive',  authorization('user', 'admin', 'super-admin'), leaderboardControllers.getLeaderboardsByPeriod)

leaderboardRouter.post('/message/create',  authorization('user', 'admin', 'super-admin'), leaderboardControllers.createLeaderboardMessage)
leaderboardRouter.get('/message/retrive',  authorization('user', 'admin', 'super-admin'), leaderboardControllers.getSpecificLeaderboardMessage)
leaderboardRouter.patch('/message/update/:messageId',  authorization('user', 'admin', 'super-admin'), leaderboardControllers.updateSpecificLeaderboardMessage)
leaderboardRouter.delete('/message/delete/:messageId',  authorization('user', 'admin', 'super-admin'), leaderboardControllers.deleteLeaderboardMessage)

export default leaderboardRouter