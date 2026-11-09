import { Router } from 'express';
import mongoose from 'mongoose';
import { getMongoStatus } from '../config/db.js';
import { getWorkspaceId, WorkspaceModel } from '../models/Workspace.js';

const router = Router();

router.get('/mongodb/status', (_req, res) => {
  res.json(getMongoStatus());
});

router.get('/workspace', async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        source: 'local_fallback',
        message: 'MongoDB Atlas is not configured or offline. Running locally.',
        state: null,
      });
    }

    const doc = await WorkspaceModel.findOne({ workspaceId: getWorkspaceId() });
    if (!doc) {
      return res.status(200).json({ source: 'mongodb_empty', state: null });
    }

    res.json({ source: 'mongodb', state: doc.state, updatedAt: doc.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load workspace';
    console.error('Error fetching workspace from MongoDB:', message);
    res.status(500).json({ error: message });
  }
});

router.post('/workspace', async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) {
      return res.status(400).json({ error: 'Workspace state is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        source: 'local_buffered',
        message: 'Saved to local buffer. MongoDB Atlas is not connected yet.',
      });
    }

    const doc = await WorkspaceModel.findOneAndUpdate(
      { workspaceId: getWorkspaceId() },
      { state, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, source: 'mongodb', updatedAt: doc?.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save workspace';
    console.error('Error saving workspace to MongoDB:', message);
    res.status(500).json({ error: message });
  }
});

export default router;

