import express from "express";
import matchHistoryControllers from "./matchHistory.controllers.js";
import authorization from "../../../middlewares/authorization.js";

const matchHistoryRouter = express.Router()

matchHistoryRouter.get('/retrive/:userId', authorization('user'), matchHistoryControllers.getRecentMatchHistoryByUserId)

export default matchHistoryRouter