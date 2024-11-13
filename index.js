const express = require('express');
const dotenv = require('dotenv');

const channelController = require('./controllers/ChannelController');
const streamController = require('./controllers/StreamController');

dotenv.config();

const app = express();
app.use(express.json());


const apiRouter = express.Router();

apiRouter.post('/current', channelController.setCurrent);
apiRouter.get('/current', channelController.getCurrent);

apiRouter.get('/', channelController.getChannels);
apiRouter.post('/add', channelController.addChannel);

app.use('/channels', apiRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
    streamController.start();
});
