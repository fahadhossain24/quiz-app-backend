import z from 'zod'

const createQuizSessionZodSchema = z.object({
  body: z.object({
    quizId: z.string({
      required_error: 'Quiz id is required!'
    }),
    participantId: z.string({
      required_error: 'Participant id is required!'
    }),
    score: z.string({
      required_error: 'Score is required!'
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

const QuizSessionValidationZodSchema = {
  createQuizSessionZodSchema
}

export default QuizSessionValidationZodSchema
