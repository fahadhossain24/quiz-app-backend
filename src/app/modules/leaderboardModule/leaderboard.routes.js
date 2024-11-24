import express from "express";
import leaderboardControllers from "./leaderboard.controllers.js";
import authorization from "../../middlewares/authorization.js";

const leaderboardRouter = express.Router();

leaderboardRouter.get('/retrive',  authorization('user', 'admin'), leaderboardControllers.getLeaderboardsByPeriod)

export default leaderboardRouter