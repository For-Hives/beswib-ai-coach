import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { IFeedback } from '@/models/Feedback';
import TrainingPlan from '@/models/TrainingPlan';

interface AdaptationRequest {
  feedback: IFeedback;
}

// This is a simplified adaptation logic. A real-world implementation would be much more complex,
// likely involving a dedicated machine learning model or a more sophisticated rules engine.
const generateAdaptationSuggestions = (feedback: IFeedback, currentPlan: any[]) => {
  const suggestions: string[] = [];
  const { adherence, sensation, pain } = feedback;

  // Example rule 1: High perceived effort
  if (sensation && sensation >= 8) {
    suggestions.push(`Sensation d'effort très élevée (${sensation}/10) détectée. La prochaine séance d'intensité sera peut-être allégée.`);
  }

  // Example rule 2: Pain reported
  if (pain && pain.hasPain) {
    suggestions.push(`Douleur rapportée au niveau de "${pain.area}". Il est conseillé de surveiller cette zone. Les séances sollicitant cette partie du corps pourraient être adaptées.`);
  }

  // Example rule 3: Didn't follow the plan
  if (adherence && adherence !== 'Oui, à la lettre') {
     suggestions.push(`La séance n'a pas été suivie à la lettre. L'intensité ou la durée des prochaines séances pourraient être ajustées pour mieux correspondre à vos possibilités.`);
  }
  
  if (suggestions.length === 0) {
      suggestions.push("Excellent retour ! Tout semble s'être bien passé. Le plan est maintenu tel quel pour le moment.")
  }

  return suggestions;
};


export async function POST(req: Request) {
  await dbConnect();
  
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  try {
    const feedbackData: IFeedback = (await req.json());
    if (!feedbackData) {
      return NextResponse.json({ error: 'Feedback data is required' }, { status: 400 });
    }

    const trainingPlan = await TrainingPlan.findOne({ userId: user._id });
    if (!trainingPlan) {
      return NextResponse.json({ error: 'Training plan not found' }, { status: 404 });
    }
    
    const suggestions = generateAdaptationSuggestions(feedbackData, trainingPlan.sessions);

    return NextResponse.json({ success: true, suggestions });

  } catch (error) {
    console.error('Error adapting training plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 