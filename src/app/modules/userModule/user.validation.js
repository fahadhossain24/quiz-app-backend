import z from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full name is required!'
    }),
    email: z.string({
      required_error: 'Email  is required!'
    }),
    password: z.string({
      required_error: 'Password is required!'
    }),
    university: z.string({
      required_error: 'University is required!'
    }),
    profession: z.string({
      required_error: 'Profession is required!'
    }),
  })
})

const getSpecificUserZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "id is missing in request params!"
    })
  })
})

const UserValidationZodSchema = {
  createUserZodSchema,
  getSpecificUserZodSchema,
}

export default UserValidationZodSchema
