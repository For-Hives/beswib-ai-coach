import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import apiClient from '@/lib/api';
import { IFeedback } from '@/models/Feedback';

// Simplified session types for comparison
interface PlannedSession {
  id: string;
  date: string;
  sessionType: string;
  title: string;
  duration_min: number;
  distance_km?: number;
}

interface RealizedSession {
  id: string;
  start_date: string;
  type: string;
  name: string;
  distance: number;
  moving_time: number;
}

export interface SessionForFeedback {
  planned: PlannedSession;
  realized: RealizedSession;
}

// Function to find the closest planned session to a realized one
const findMatchingSession = (realized: RealizedSession, plan: PlannedSession[]): PlannedSession | null => {
  const realizedDate = new Date(realized.start_date);
  let closestSession: PlannedSession | null = null;
  let smallestDiff = Infinity;

  for (const planned of plan) {
    const plannedDate = new Date(planned.date);
    const timeDiff = Math.abs(plannedDate.getTime() - realizedDate.getTime());
    
    // Check if it's on the same day (or within 12 hours)
    if (timeDiff < 12 * 60 * 60 * 1000) {
      if (timeDiff < smallestDiff) {
        smallestDiff = timeDiff;
        closestSession = planned;
      }
    }
  }
  return closestSession;
};

export const useSessionForFeedback = () => {
  const { token } = useAuth();
  const [sessionForFeedback, setSessionForFeedback] = useState<SessionForFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAndCompare = async () => {
      setLoading(true);
      try {
        const [planData, activities, feedbacks] = await Promise.all([
          apiClient<{ trainingPlan: PlannedSession[] }>('/api/training-plan'),
          apiClient<RealizedSession[]>('/api/strava/activities?per_page=5'), // Check last 5 activities
          apiClient<IFeedback[]>('/api/feedback'),
        ]);

        const submittedFeedbackIds = new Set(feedbacks.map(f => f.sessionId));
        const recentActivities = activities.filter(a => !submittedFeedbackIds.has(String(a.id)));
        
        // Find the most recent activity that has a matching planned session and no feedback
        for (const activity of recentActivities) {
          const matchingPlan = findMatchingSession(activity, planData.trainingPlan);
          if (matchingPlan) {
            setSessionForFeedback({ planned: matchingPlan, realized: activity });
            // We found our session, we can stop
            break; 
          }
        }
      } catch (error) {
        console.error("Error fetching session for feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCompare();
  }, [token]);

  return { sessionForFeedback, loading };
}; 