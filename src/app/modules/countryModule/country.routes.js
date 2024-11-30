import express from "express";
import countryController from "./country.controller.js";


const countryRouter = express.Router()

countryRouter.post('/insert', countryController.insertCountry)
countryRouter.get('/retrive', countryController.getCountries)

export default countryRouter