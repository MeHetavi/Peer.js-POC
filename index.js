const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const roomId = uuidv4();
    res.redirect(`/${roomId}`)
})

app.get('/:roomId', (req, res) => {
    res.render('room', { roomId: req.params.roomId });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        if (!roomId || !userId) {
            console.error('Invalid roomId or userId:', { roomId, userId });
            return;
        }

        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);

        // Emit to all other users in the room
        socket.to(roomId).emit('user-connected', userId);
    });
});

server.listen(3002);