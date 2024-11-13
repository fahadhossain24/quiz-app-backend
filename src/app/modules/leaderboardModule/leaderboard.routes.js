import express from "express";
import leaderboardControllers from "./leaderboard.controllers.js";

const leaderboardRouter = express.Router();

leaderboardRouter.get('/retrive', leaderboardControllers.getLeaderboardsByPeriod)

export default leaderboardRouter