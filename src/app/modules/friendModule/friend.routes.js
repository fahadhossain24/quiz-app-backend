import express from "express";
import friendControllers from "./friend.controllers.js";
import authorization from "../../middlewares/authorization.js";

const friendsRouter = express.Router()

friendsRouter.get('/retrive/:userId', authorization('user'), friendControllers.getFriendsByUserId)

export default friendsRouter