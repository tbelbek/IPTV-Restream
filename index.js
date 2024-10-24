const express = require('express');
const dotenv = require('dotenv');
const streamController = require('./controllers/StreamController');

dotenv.config();

const app = express();
const apiRouter = express.Router();


apiRouter.post('/set-channel/:id', streamController.setChannel);
apiRouter.get('/get-channel', streamController.getChannel);
apiRouter.post('/stop', streamController.stop);

app.use('/api', apiRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
    streamController.setChannel({ params: { id: process.env.DEFAULT_CHANNEL_ID } }, { status: () => ({ json: () => {} }) });
});
