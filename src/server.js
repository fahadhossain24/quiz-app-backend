import mongoose from 'mongoose';
import config from './config/index.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import realtimeQuiz, { connectedUsers } from './app/socket/quiz.socket.js';

const port = 5005;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to your frontend origin in production
    methods: ['GET', 'POST'],
  },
});

// Initialize real-time quiz handling
realtimeQuiz(io);

const dbConnection = async () => {
  await mongoose.connect(config.database_url);
  console.log('Database connection successful');
  
  server.listen(port || config.server_port, () => {
    console.log('Server is listening on port', port || config.server_port);
  });
};

dbConnection();


export {io, connectedUsers}