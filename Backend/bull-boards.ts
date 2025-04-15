const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');

const myQueue = new Queue('scheduler', { redis: { host: 'localhost', port: 6060 } });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(myQueue)],
  serverAdapter,
});

const app = express();
app.use('/admin/queues', serverAdapter.getRouter());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Bull Board dashboard chạy tại http://localhost:${PORT}/admin/queues`);
});
