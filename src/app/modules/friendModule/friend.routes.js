import express from "express";
import friendControllers from "./friend.controllers.js";

const friendsRouter = express.Router()

friendsRouter.get('/retrive/:userId', friendControllers.getFriendsByUserId)

export default friendsRouter