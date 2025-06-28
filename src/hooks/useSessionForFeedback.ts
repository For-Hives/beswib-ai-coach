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
  isUnplanned?: boolean;
}

// Function to find the closest planned session to a realized one
const findMatchingSession = (realized: RealizedSession, plan: PlannedSession[]): PlannedSession | null => {
  const realizedDate = new Date(realized.start_date);
  let closestSession: PlannedSession | null = null;
  let smallestDiff = Infinity;

  // Prioritize type mapping. Strava "Run" matches "Endurance", "Fractionné", etc.
  const isRun = realized.type === 'Run';
  
  for (const planned of plan) {
    const plannedDate = new Date(planned.date);
    const timeDiff = Math.abs(plannedDate.getTime() - realizedDate.getTime());

    // Check if it's within a 48-hour window (24h before, 24h after)
    if (timeDiff < 24 * 2 * 60 * 60 * 1000) {
      // Basic type matching: a Strava "Run" can match any running session type.
      const typeMatches = isRun && ['Endurance', 'Fractionné', 'Long', 'Récupération', 'Seuil'].includes(planned.sessionType);

      if (typeMatches && timeDiff < smallestDiff) {
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
        
        if (recentActivities.length === 0) {
          setLoading(false);
          return;
        }

        let sessionToReview: SessionForFeedback | null = null;

        // 1. Try to find a planned session for the most recent activities
        for (const activity of recentActivities) {
          const matchingPlan = findMatchingSession(activity, planData.trainingPlan);
          if (matchingPlan) {
            sessionToReview = { planned: matchingPlan, realized: activity, isUnplanned: false };
            break; 
          }
        }

        // 2. If no match, take the most recent unplanned activity (that is not rest)
        if (!sessionToReview) {
          const latestActivity = recentActivities[0];
          const activityType = latestActivity.type.toLowerCase();
          const isRestType = ['walk', 'yoga'].includes(activityType) || latestActivity.name.toLowerCase().includes('repos');

          if (!isRestType) {
            const dummyPlannedSession: PlannedSession = {
              id: `unplanned-${latestActivity.id}`,
              date: latestActivity.start_date,
              sessionType: latestActivity.type,
              title: latestActivity.name || 'Séance imprévue',
              duration_min: Math.round(latestActivity.moving_time / 60),
              distance_km: parseFloat((latestActivity.distance / 1000).toFixed(2)),
            };
            sessionToReview = { planned: dummyPlannedSession, realized: latestActivity, isUnplanned: true };
          }
        }
        
        setSessionForFeedback(sessionToReview);

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