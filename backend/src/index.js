import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/db.js';
import workspaceRoutes from './routes/workspace.js';
import geminiRoutes from './routes/gemini.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: frontendOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'pk-workspace-backend' });
});

app.use('/api', workspaceRoutes);
app.use('/api', geminiRoutes);

async function startServer() {
  await connectMongoDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PK Workspace API listening on http://localhost:${PORT}`);
  });
}

startServer();

