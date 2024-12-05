import express from "express";
import countryController from "./country.controller.js";

const universityRouter = express.Router();

universityRouter.post('/insert', countryController.insertUniversity)
universityRouter.get('/search', countryController.searchUniversity)

export default universityRouter