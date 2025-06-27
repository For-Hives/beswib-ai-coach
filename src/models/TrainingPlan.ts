import { Schema, model, models, Document } from 'mongoose';

// Interface for a single session within the plan
export interface ITrainingSession {
  id: string; // Unique identifier for the session
  date: string; // ISO date string
  sessionType: string; // e.g., 'Endurance', 'Intervals', 'Recovery'
  title: string;
  description: string;
  duration_min: number;
  distance_km?: number;
  intensity?: string; // e.g., 'Z2', 'VO2max'
  status: 'planned' | 'completed' | 'skipped';
}

// Interface for the whole training plan document
export interface ITrainingPlan extends Document {
  userId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  sessions: ITrainingSession[];
  goals: string[]; // User-defined goals
}

const TrainingSessionSchema = new Schema<ITrainingSession>({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  sessionType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration_min: { type: Number, required: true },
  distance_km: { type: Number },
  intensity: { type: String },
  status: { type: String, enum: ['planned', 'completed', 'skipped'], default: 'planned' },
});

const TrainingPlanSchema = new Schema<ITrainingPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sessions: [TrainingSessionSchema],
  goals: [{ type: String }],
}, { timestamps: true });

const TrainingPlan = models.TrainingPlan || model<ITrainingPlan>('TrainingPlan', TrainingPlanSchema);

export default TrainingPlan; 