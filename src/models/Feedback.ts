import { Schema, model, models, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: Schema.Types.ObjectId;
  sessionId: string;
  sessionDate: string;
  sessionTitle: string;
  
  adherence: string; 
  sensation: number; 
  comment?: string;
  
  pain: {
    hasPain: boolean;
    area?: string;
  };
  
  plannedVsRealized: {
    planned: {
      duration_min: number;
      distance_km?: number | null;
    };
    realized: {
      duration_min: number;
      distance_km?: number | null;
    };
  };
  
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  sessionDate: { type: String, required: true },
  sessionTitle: { type: String, required: true },
  
  adherence: { type: String, required: true },
  sensation: { type: Number, required: true },
  comment: { type: String },

  pain: {
    hasPain: { type: Boolean, required: true },
    area: { type: String }
  },
  
  plannedVsRealized: {
    planned: {
      duration_min: Number,
      distance_km: Number,
    },
    realized: {
      duration_min: Number,
      distance_km: Number,
    }
  },
  
  createdAt: { type: Date, default: Date.now }
});

const Feedback = models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback; 