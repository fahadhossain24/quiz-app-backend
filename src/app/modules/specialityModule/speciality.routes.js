import express from "express";
import specialityControllers from "./speciality.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SpecialityValidationZodSchema from "./speciality.validation.js";


const specialityRouter = express.Router();

specialityRouter.post('/create', requestValidator(SpecialityValidationZodSchema.createSpecialityZodSchema), specialityControllers.createSpeciality)
specialityRouter.get('/retrive/:id', requestValidator(SpecialityValidationZodSchema.getSpecificSpecialityZodSchema), specialityControllers.getSpecificSeciality)

export default specialityRouter