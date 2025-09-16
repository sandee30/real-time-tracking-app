const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for location
    socket.on('sendLocation', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    // When user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
