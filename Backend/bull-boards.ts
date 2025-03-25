import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import Queue from 'bull';

// Tạo queue Bull
const myQueue = new Queue('scheduler', { redis: { host: 'localhost', port: 6060 } });

// Tạo adapter cho Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Tạo Bull Board dashboard
createBullBoard({
  queues: [new BullAdapter(myQueue)],
  serverAdapter,
});

// Tạo ứng dụng Express (hoặc lấy Express instance từ NestJS)
const app = express();
app.use('/admin/queues', serverAdapter.getRouter());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Bull Board dashboard chạy tại http://localhost:${PORT}/admin/queues`);
});
