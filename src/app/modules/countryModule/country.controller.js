import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import Country from './country.model.js'
import axios from 'axios'
import CustomError from '../../errors/index.js'
import University from './university.model.js'

// const insertCountry = async (req, res) => {
//   try {
//     let page = 1; // Start with the first page
//     let countries = []; // Array to hold all countries

//     // Fetch countries from all pages
//     while (true) {
//       const response = await axios.get(`https://api.worldbank.org/v2/country?page=${page}&format=json`);

//       // Check if response contains valid data
//       if (!response.data || !Array.isArray(response.data[1])) {
//         throw new CustomError.BadRequestError('Failed to retrieve countries data!');
//       }

//       const currentPageCountries = response.data[1];
//       if (currentPageCountries.length === 0) {
//         break; // Exit loop if no more countries on the current page
//       }

//       countries = [...countries, ...currentPageCountries]; // Add current page countries to the list
//       page++; // Increment to fetch the next page
//     }

//     // Now insert all countries into the database
//     const countryPromises = countries.map(async (country) => {
//       const { id, name } = country; // Extract country code (id) and name

//       // Check if the country already exists in the database
//       const existingCountry = await Country.findOne({ shortName: id });

//       if (existingCountry) {
//         // If country exists, skip saving it
//         console.log(`Country ${name} with code ${id} already exists in the database.`);
//         return null; // Skip this country
//       }

//       // Flag URL mapping (you can use any service to map the country code to a flag image URL)
//       const flagUrl = `https://flagcdn.com/w320/${id.toLowerCase()}.png`; // Example flag URL using country code

//       const payload = {
//         common: name, // Full country name
//         shortName: id, // Country short name (code)
//         flagUrl: flagUrl // Flag URL
//       };

//       // Save the new country to the database
//       const newCountry = new Country(payload);
//       return newCountry.save();
//     });

//     // Filter out any null values (countries that were skipped because they already exist)
//     const results = await Promise.all(countryPromises);

//     // Filter out any `null` entries from the results (in case any country was skipped)
//     const savedCountries = results.filter(result => result !== null);

//     // Send success response
//     sendResponse(res, {
//       statusCode: StatusCodes.CREATED,
//       status: 'success',
//       message: `${savedCountries.length} countries added successfully!`
//     });
//   } catch (error) {
//     console.error(error);
//     sendResponse(res, {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       status: 'error',
//       message: `An error occurred while inserting countries: ${error.message}`
//     });
//   }
// };

const insertCountry = async (req, res) => {
  try {
    let page = 1 // Start with the first page
    let countries = [] // Array to hold all countries

    // Fetch countries from all pages
    while (true) {
      const response = await axios.get(`https://api.worldbank.org/v2/country?page=${page}&format=json`)

      // Check if response contains valid data
      if (!response.data || !Array.isArray(response.data[1])) {
        throw new CustomError.BadRequestError('Failed to retrieve countries data!')
      }

      const currentPageCountries = response.data[1]
      if (currentPageCountries.length === 0) {
        break // Exit loop if no more countries on the current page
      }

      countries = [...countries, ...currentPageCountries] // Add current page countries to the list
      page++ // Increment to fetch the next page
    }

    // Now insert all countries into the database
    const countryPromises = countries.map(async (country) => {
      const { id, name, iso2Code } = country // Extract country code (id) and name

      // Skip if the country is not valid (has no ISO2 code or is a region)
      if (!iso2Code || iso2Code.length !== 2 || name.includes('IBRD-only') || name.includes('Region')) {
        console.log(`Skipping non-country entry: ${name}`)
        return null // Skip non-country entries
      }

      const isoCode = iso2Code.toLowerCase() // Convert country code to lowercase (ISO2 code)

      // Check if the country already exists in the database
      const existingCountry = await Country.findOne({ shortName: id })

      if (existingCountry) {
        // If country exists, skip saving it
        console.log(`Country ${name} with code ${id} already exists in the database.`)
        return null // Skip this country
      }

      // Flag URL via Flagpedia API (ISO2 code)
      const flagUrl = `https://flagpedia.net/data/flags/h80/${isoCode}.png`

      const payload = {
        common: name, // Full country name
        shortName: id, // Country short name (code)
        flagUrl: flagUrl // Flag URL
      }

      // Save the new country to the database
      const newCountry = new Country(payload)
      return newCountry.save()
    })

    // Filter out any null values (countries that were skipped because they already exist or are non-country entries)
    const results = await Promise.all(countryPromises)

    // Filter out any `null` entries from the results (in case any country was skipped)
    const savedCountries = results.filter((result) => result !== null)

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: `${savedCountries.length} countries added successfully!`
    })
  } catch (error) {
    console.error(error)
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'error',
      message: `An error occurred while inserting countries: ${error.message}`
    })
  }
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

const insertUniversity = async (req, res) => {
  const response = await axios.get(`http://universities.hipolabs.com/search`, {
    timeout: 15000 // Set timeout to 10 seconds or adjust as needed
  })

  // If no universities are found, handle it
  if (response.data.length === 0) {
    throw new CustomError.NotFoundError('No universities found!')
  }
  // console.log(response.data)
  const universityPromises = response.data.map((universityData) => {
    const { name } = universityData // Extract university name from API response

    const newUniversity = new University({
      name
    })

    return newUniversity.save()
  })

  await Promise.all(universityPromises)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Universities for added successfully!`
  })
}

const searchUniversity = async (req, res) => {
  const { query } = req.query

  // If no query is provided, return all universities
  if (!query) {
    const universities = await University.find().select('-__v')
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Universities retrieved successfully!',
      data: universities
    })
  }

  // Case-insensitive partial search for universities by name
  const universities = await University.find({
    name: { $regex: query, $options: 'i' }
  }).select('-__v')

  if (universities.length === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      status: 'fail',
      message: 'No universities found matching the query.',
      data: []
    })
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'University search successful!',
    data: universities
  })
}

export default {
  insertCountry,
  getCountries,
  insertUniversity,
  searchUniversity
}
