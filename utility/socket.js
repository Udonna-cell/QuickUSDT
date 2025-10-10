module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Listen for messages
    socket.on("chat message", (msg) => {
      console.log("💬 Message:", msg);
      io.emit("chat message", msg); // Broadcast to all
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};