import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectMongoDB } from '@/lib/mongodb';
import { WorkspaceModel, getWorkspaceId } from '@/lib/models/Workspace';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectMongoDB().catch(() => null);

    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({
        source: 'local_fallback',
        message: 'MongoDB Atlas is not configured or offline. Running locally.',
        state: null,
      });
    }

    const doc = await WorkspaceModel.findOne({ workspaceId: getWorkspaceId() });
    if (!doc) {
      return NextResponse.json({ source: 'mongodb_empty', state: null });
    }

    return NextResponse.json({
      source: 'mongodb',
      state: doc.state,
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load workspace';
    console.error('Error fetching workspace:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { state } = body;
    if (!state) {
      return NextResponse.json({ error: 'Workspace state is required' }, { status: 400 });
    }

    await connectMongoDB().catch(() => null);

    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json({
        success: true,
        source: 'local_buffered',
        message: 'Saved to local buffer. MongoDB is not connected yet.',
      });
    }

    const doc = await WorkspaceModel.findOneAndUpdate(
      { workspaceId: getWorkspaceId() },
      { state, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      updatedAt: doc?.updatedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save workspace';
    console.error('Error saving workspace:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

