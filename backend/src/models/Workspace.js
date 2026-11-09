import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      default: 'muhammed_anas_default',
    },
    state: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false, collection: 'workspaces' }
);

export const WorkspaceModel =
  mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);

export function getWorkspaceId() {
  return process.env.WORKSPACE_ID || 'muhammed_anas_default';
}

