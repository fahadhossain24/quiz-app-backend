import z from 'zod'

const startQuizZodSchema = z.object({
  body: z.object({
    participantA: z.string({
      required_error: 'Participant A is required!'
    }),
    participantB: z.string({
      required_error: 'Participant B is required!'
    })
  })
})

// const getSpecificUserZodSchema = z.object({
//   params: z.object({
//     id: z.string({
//       required_error: "id is missing in request params!"
//     })
//   })
// })

const QuizValidationZodSchema = {
    startQuizZodSchema
}

export default QuizValidationZodSchema
