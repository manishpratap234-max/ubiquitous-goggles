function registerRideSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('driver:location:update', ({ captainId, location }) => {
      io.to(`user:${captainId}`).emit('driver:location', location);
    });

    socket.on('ride:status:update', ({ rideId, riderId, captainId, status }) => {
      io.to(`user:${riderId}`).to(`user:${captainId}`).emit('ride:status', { rideId, status });
    });

    socket.on('chat:message', ({ rideId, fromUserId, toUserId, message }) => {
      io.to(`user:${toUserId}`).emit('chat:message', { rideId, fromUserId, message, at: new Date() });
    });
  });
}

module.exports = { registerRideSocket };
