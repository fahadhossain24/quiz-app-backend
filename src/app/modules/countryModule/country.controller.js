import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import Country from './country.model.js'
import axios from 'axios'

const insertCountry = async (req, res) => {
  const response = await axios.get('https://restcountries.com/v3.1/all')
  const countries = response.data

  const countryPromises = countries.map((country) => {
    const payload = {
      common: country.name.common,
      shortName: country.cioc,
      flagUrl: country.flags.png
    }
    const newCountry = new Country(payload)
    return newCountry.save()
  })

  await Promise.all(countryPromises)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Country insert successfull!'
  })
}

const getCountries = async (req, res) => {
  const countries = await Country.find().select('-_id -__v')

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Countries retrive successfull!',
    data: countries
  })
}

export default {
  insertCountry,
  getCountries
}
