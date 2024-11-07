export function shuffleQuestionOptions(options) {
  const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']

  const allOptions = [
    options.optionB,
    options.optionC,
    options.optionD,
    options.optionE
  ]
  console.log(allOptions)

  allOptions.push(options.answer)

  const shuffledOptions = shuffleArray(allOptions)

  const shuffledOptionsObject = {}

  shuffledOptions.forEach((value, index) => {
    shuffledOptionsObject[optionKeys[index]] = value // Assign shuffled values to optionA, B, C, D, E
  })

  shuffledOptionsObject.answer = options.answer

  return shuffledOptionsObject
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // Swap
  }
  return array
}
