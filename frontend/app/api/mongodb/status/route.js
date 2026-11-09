import { NextResponse } from 'next/server';
import { connectMongoDB, getMongoStatus } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectMongoDB().catch(() => null);
  return NextResponse.json(getMongoStatus());
}

