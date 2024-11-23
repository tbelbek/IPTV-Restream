const express = require('express');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const ChatSocketHandler = require('./socket/ChatSocketHandler');
const ChannelSocketHandler = require('./socket/ChannelSocketHandler');

const channelController = require('./controllers/ChannelController');
const streamController = require('./controllers/StreamController');
const ChannelService = require('./services/ChannelService');

dotenv.config();

const app = express();
app.use(express.json());

const apiRouter = express.Router();

apiRouter.get('/', channelController.getChannels);
apiRouter.get('/current', channelController.getCurrentChannel);

app.use('/api/channels', apiRouter);

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
    if(ChannelService.getCurrentChannel().restream) {
        streamController.start();
    }
});


// Web Sockets
const io = new Server(server);

const connectedUsers = {};

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('new-user', userId => {
    connectedUsers[socket.id] = userId;
    socket.broadcast.emit('user-connected', userId);
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', connectedUsers[socket.id]);
    delete connectedUsers[socket.id];
  })

  ChannelSocketHandler(io, socket);

  ChatSocketHandler(io, socket);
})
