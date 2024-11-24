import express from "express";
import specialityControllers from "./speciality.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SpecialityValidationZodSchema from "./speciality.validation.js";
import authorization from "../../middlewares/authorization.js";


const specialityRouter = express.Router();

specialityRouter.post('/create', authorization('admin'), requestValidator(SpecialityValidationZodSchema.createSpecialityZodSchema), specialityControllers.createSpeciality)
specialityRouter.get('/retrive/all', authorization('admin', 'user'), specialityControllers.getAllSeciality)
specialityRouter.get('/retrive/:id', authorization('user', 'admin'), requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.getSpecificSeciality)
specialityRouter.patch('/modify/:id', authorization('admin', 'user'), requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.modifySpeciality)
specialityRouter.patch('/modify/condition/:id', authorization('user', 'admin'), requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.modifyCondition)
specialityRouter.delete('/delete/:id', authorization('user', 'admin'), requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.deleteSpeciality)

export default specialityRouter