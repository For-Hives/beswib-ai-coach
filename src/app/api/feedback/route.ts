import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Feedback from '@/models/Feedback';
import jwt from 'jsonwebtoken';

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { sessionId, sessionDate, sessionTitle, adherence, sensation, pain, comment, planAdaptationRequested } = body;

    // Basic validation
    if (!sessionId || !sessionDate || !sensation || !pain) {
        return NextResponse.json({ error: 'Missing required feedback fields' }, { status: 400 });
    }

    const newFeedback = new Feedback({
      userId: user._id,
      sessionId,
      sessionDate,
      sessionTitle,
      adherence,
      sensation,
      pain,
      comment,
      planAdaptationRequested,
    });

    await newFeedback.save();

    return NextResponse.json({ message: 'Feedback saved successfully', feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const feedbacks = await Feedback.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 