import express from "express";
import friendControllers from "./friend.controllers.js";
import authorization from "../../middlewares/authorization.js";

const friendsRouter = express.Router()

friendsRouter.post('/add', authorization('user'), friendControllers.addFriend)
friendsRouter.get('/retrive/:userId', authorization('user'), friendControllers.getFriendsByUserId)

export default friendsRouter