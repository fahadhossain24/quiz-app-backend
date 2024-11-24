const connectedUsers = {}
const realtimeQuiz = (io) => {
  // Store connected users by user ID and socket ID

  // Set up global socket events
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    const userId = socket.handshake.query.userId
    if (userId) {
      connectedUsers[userId] = socket.id
    }
    console.log(connectedUsers)

    // Handle Player B accepting the quiz invitation
    socket.on('accept-quiz', ({ quizId, participantId, quiz }) => {
      // console.log(quizId, participantId, quiz)
      if (!quizId || !participantId) {
        socket.emit('error', { message: 'Invalid quiz or participant data' })
        return
      }

      socket.join(quizId) // Player B joins the room

      // Check if both participants are in the room
      const room = io.sockets.adapter.rooms.get(quizId)
      if (room && room.size === 2) {
        // Emit quiz-start to both participants
        io.to(quizId).emit('quiz-start', { status: 'ready', message: 'Game is starting!' })
      }
    })

    socket.on('reject-quiz', ({ status }) => {
      io.to(quizId).emit('reject-quiz', { status, message: 'Opponent reject you invitation! keep trying to another opponent.' })
    })

    // Handle Player A joining the room and waiting for the opponent
    socket.on('join-quiz', ({ quizId }) => {
      if (!quizId) {
        socket.emit('error', { message: 'Quiz ID is missing' })
        return
      }

      socket.join(quizId)

      const room = io.sockets.adapter.rooms.get(quizId)
      if (room && room.size < 2) {
        // Notify Player A that they are waiting for the opponent
        socket.emit('waiting-for-opponent', { status: 'waiting', message: 'Waiting for opponent to join...' })
      }
    })

    // Real-time score update handling
    socket.on('update-score', ({ quizId, participantId, score, state }) => {
      if (!quizId || !participantId || score === undefined) {
        socket.emit('error', { message: 'Incomplete score data' })
        return
      }

      // Broadcast the score update to the other participant
      socket.to(quizId).emit('score-update', { participantId, score, state })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      delete connectedUsers[userId] // Clean up on disconnect
    })
  })
}

export default realtimeQuiz
export { connectedUsers }
