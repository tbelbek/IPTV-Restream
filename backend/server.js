const express = require('express');
const dotenv = require('dotenv');

const channelController = require('./controllers/ChannelController');
const streamController = require('./controllers/StreamController');

dotenv.config();

const app = express();
app.use(express.json());

const apiRouter = express.Router();

apiRouter.get('/', channelController.getChannels);
apiRouter.get('/current', channelController.getCurrentChannel);

app.use('/channels', apiRouter);

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
    streamController.start();
});


// Web Sockets
const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {

  socket.on('new-user', name => {
    connectedUsers[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', connectedUsers[socket.id])
    delete connectedUsers[socket.id]
  })

  ChannelSocketHandler(io, socket);

  ChatSocketHandler(io, socket);

})
