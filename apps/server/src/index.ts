import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import searchRoutes from './routes/search';
import usersRoutes from './routes/users';
import notifyRoutes from './routes/notify';
import { setupNotifyGateway } from './socket/notifyGateway';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notify', notifyRoutes);

setupNotifyGateway(io);

app.use(errorHandler);

const PORT = process.env.PORT || 3089;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
