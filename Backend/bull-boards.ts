const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');
const dotenv = require('dotenv')
const myQueue = new Queue('scheduler', { redis: { host: 'localhost', port: 6060 } });

dotenv.config()

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(myQueue)],
  serverAdapter,
});

const app = express();
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(process.env.BULL_BOARD_PORT, () => {
  console.log(`Bull Board dashboard runs at http://${process.env.BULL_BOARD_HOST}:${process.env.BULL_BOARD_PORT}/admin/queues`);
});
