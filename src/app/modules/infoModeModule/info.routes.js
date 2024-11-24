import express from "express";
import infoControllers from "./info.controllers.js";
import authorization from "../../middlewares/authorization.js";


const infoRouter = express.Router();

infoRouter.post('/create', authorization('admin'), infoControllers.createInfo)
infoRouter.get('/retrive/all', authorization('user', 'admin'), infoControllers.getAllInfo)
infoRouter.patch('/update/:id', authorization('admin'), infoControllers.updateInfo)
infoRouter.delete('/delete/:id', authorization('admin'), infoControllers.deleteInfo)

export default infoRouter