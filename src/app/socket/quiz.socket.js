const connectedUsers = {}
const activeAppUsers = []
const realtimeQuiz = (io) => {
  // Store connected users by user ID and socket ID

  // Set up global socket events
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    const userId = socket.handshake.query.userId

    if (userId) {
      connectedUsers[userId] = socket.id
      if (!activeAppUsers.includes(userId)) {
        activeAppUsers.push(userId)
      }
    }
    console.log(connectedUsers)
    console.log(activeAppUsers)
    // console.log(activeAppUsers.includes(userId))

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

    // socket.on('reject-quiz', ({ status, quizId }) => {
    //   io.to(quizId).emit('reject-quiz', {quizId, status, message: 'Opponent reject you invitation! keep trying to another opponent.' })
    // })

    socket.on('reject-quiz', ({ status, quizId }) => {
      // Notify both participants about rejection
      io.to(quizId).emit('reject-quiz', {
        quizId,
        status,
        message: 'Opponent rejected your invitation! Keep trying with another opponent.'
      })

      // Close the room by leaving and cleaning up
      io.sockets.adapter.rooms.delete(quizId) // Delete the room from the adapter
      io.sockets.emit('room-closed', { quizId, message: 'Room closed due to rejection' }) // Optionally notify about room closure

      // Remove users from the room
      const room = io.sockets.adapter.rooms.get(quizId)
      if (room) {
        room.forEach((socketId) => {
          io.sockets.sockets.get(socketId).leave(quizId) // Disconnect all users from the room
        })
      }
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

      // Remove user from active users array
      if (userId && activeAppUsers.includes(userId)) {
        const index = activeAppUsers.indexOf(userId)
        if (index !== -1) {
          activeAppUsers.splice(index, 1)
        }
      }
      // console.log(activeAppUsers)
    })
  })
}

export default realtimeQuiz
export { connectedUsers, activeAppUsers }
