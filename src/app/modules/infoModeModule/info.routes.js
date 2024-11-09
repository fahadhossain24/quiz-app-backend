import express from "express";
import infoControllers from "./info.controllers.js";


const infoRouter = express.Router();

infoRouter.post('/create', infoControllers.createInfo)
infoRouter.get('/retrive/all', infoControllers.getAllInfo)
infoRouter.patch('/update/:id', infoControllers.updateInfo)
infoRouter.delete('/delete/:id', infoControllers.deleteInfo)

export default infoRouter