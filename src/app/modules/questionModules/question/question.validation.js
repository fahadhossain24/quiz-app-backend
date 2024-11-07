import z from 'zod';

const createQuestionZodSchema = z.object({
    body: z.object({
      question: z.string({
        required_error: 'Question is required!',
      }),
      readTime: z.string({
        required_error: 'Question read time is required!',
      }),
      answerTime: z.string({
        required_error: 'Question answer time is required!',
      }),
      options: z.object({
        answer: z.string({
          required_error: 'Correct answer is required!',
        }),
        optionB: z.string({
          required_error: 'Option B is required!',
        }),
        optionC: z.string({
          required_error: 'Option C is required!',
        }),
        optionD: z.string({
          required_error: 'Option D is required!',
        }),
        optionE: z.string({
          required_error: 'Option E is required!',
        }),
      }),
      speciality: z.string({
        required_error: 'Speciality is required!',
      }),
      condition: z.string({
        required_error: 'Condition is required!',
      }),
      explanation: z.string().optional()
    })
  });

const getSpecificQuestionZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "id is missing in request params!"
    })
  })
})

const QuestionValidationZodSchema = {
    createQuestionZodSchema,
  getSpecificQuestionZodSchema,
}

export default QuestionValidationZodSchema
