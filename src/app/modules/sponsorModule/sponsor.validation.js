import z from 'zod'

const createAdsZodSchema = z.object({
  body: z.object({
    showing_period: z.string({
      required_error: 'Ads showing period is required!'
    })
  })
})

const getSpecificAdsZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'id is missing in request params!'
    })
  })
})

const getSpecificSplashScreenZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'id is missing in request params!'
    })
  })
})

const SponsorValidationZodSchema = {
  createAdsZodSchema,
  getSpecificAdsZodSchema,
  getSpecificSplashScreenZodSchema
}

export default SponsorValidationZodSchema
