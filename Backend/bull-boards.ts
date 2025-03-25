const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const Queue = require('bull');

// Tạo queue Bull
const myQueue = new Queue('my-queue', { redis: { host: 'localhost', port: 6379 } });

// Tạo adapter cho Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Tạo Bull Board dashboard
createBullBoard({
  queues: [new BullAdapter(myQueue)],
  serverAdapter,
});

// Tạo ứng dụng Express
const app = express();
app.use('/admin/queues', serverAdapter.getRouter());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Bull Board dashboard chạy tại http://localhost:${PORT}/admin/queues`);
});
