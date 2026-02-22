const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { port } = require('./config/env');
const { connectDatabase } = require('./config/db');
const { registerRideSocket } = require('./sockets/rideSocket');

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  registerRideSocket(io);

  server.listen(port, () => {
    console.log(`Backend listening at :${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Boot failed', error);
  process.exit(1);
});
