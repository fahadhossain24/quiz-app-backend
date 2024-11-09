import express from "express";
import specialityControllers from "./speciality.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SpecialityValidationZodSchema from "./speciality.validation.js";


const specialityRouter = express.Router();

specialityRouter.post('/create', requestValidator(SpecialityValidationZodSchema.createSpecialityZodSchema), specialityControllers.createSpeciality)
specialityRouter.get('/retrive/all', specialityControllers.getAllSeciality)
specialityRouter.get('/retrive/:id', requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.getSpecificSeciality)
specialityRouter.patch('/modify/:id', requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.modifySpeciality)
specialityRouter.patch('/modify/condition/:id', requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.modifyCondition)
specialityRouter.delete('/delete/:id', requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.deleteSpeciality)

export default specialityRouter