import express from "express";
import infoControllers from "./info.controllers.js";
import authorization from "../../middlewares/authorization.js";


const infoRouter = express.Router();

infoRouter.post('/create', authorization('admin', 'super-admin'), infoControllers.createInfo)
infoRouter.get('/retrive/all', authorization('user', 'admin', 'super-admin'), infoControllers.getAllInfo)
infoRouter.get('/retrive/:id', authorization('user', 'admin', 'super-admin'), infoControllers.getSpecificInfo)
infoRouter.patch('/update/:id', authorization('admin', 'super-admin'), infoControllers.updateInfo)
infoRouter.delete('/delete/:id', authorization('admin', 'super-admin'), infoControllers.deleteInfo)

export default infoRouter