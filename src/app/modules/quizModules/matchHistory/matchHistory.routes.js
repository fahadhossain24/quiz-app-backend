import express from "express";
import matchHistoryControllers from "./matchHistory.controllers.js";

const matchHistoryRouter = express.Router()

matchHistoryRouter.get('/retrive/:userId', matchHistoryControllers.getRecentMatchHistoryByUserId)

export default matchHistoryRouter