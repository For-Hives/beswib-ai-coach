import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import apiClient, { ApiError } from '@/lib/api';

// --- Type Definitions ---
interface StravaMonthSummary {
  distance: number;
  count: number;
  elapsed_time: number;
}

interface StravaSummary {
  month: StravaMonthSummary;
}

interface UserProfile {
  goalName?: string;
  goalDate?: string;
}

interface TrainingPlan {
  // Définir la structure du plan si connue, sinon garder any pour le moment
  [key: string]: any;
}

export interface DashboardMetrics {
  kmThisMonth: string;
  nSessions: number;
  nSessionsPlanned: number; // Vous voudrez peut-être rendre cela dynamique
  percentSessions: number;
  progression: number;
  goalName: string;
  weeksLeft: number | string;
  percentGoal: number; // Logique à définir
}

// --- Custom Hook ---
export const useDashboardMetrics = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [summary, activities, profileData, prevMonthSummary] = await Promise.all([
          apiClient<StravaSummary>('/api/strava/summary'),
          apiClient<any[]>('/api/strava/activities'),
          apiClient<{ profile: UserProfile }>('/api/profile'),
          apiClient<StravaSummary>('/api/strava/summary?prevMonth=1'),
        ]);

        // --- Data Processing ---
        const profile = profileData.profile;
        const kmThisMonth = summary?.month?.distance ? (summary.month.distance / 1000).toFixed(0) : "0";
        const nSessions = activities.filter(a => a.start_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).length;
        const nSessionsPlanned = 20; // TODO: Rendre dynamique
        const percentSessions = nSessionsPlanned ? Math.round((nSessions / nSessionsPlanned) * 100) : 0;
        const prevMonthDistance = prevMonthSummary?.month?.distance || 0;
        const progression = prevMonthDistance ? Math.round(((summary.month.distance - prevMonthDistance) / prevMonthDistance) * 100) : 0;
        
        const goalName = profile?.goalName || "Non défini";
        
        const getWeeksLeft = (dateStr: string | undefined): number | string => {
          if (!dateStr) return "-";
          const now = new Date();
          const target = new Date(dateStr);
          const diff = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7);
          return diff > 0 ? Math.ceil(diff) : 0;
        };
        const weeksLeft = getWeeksLeft(profile?.goalDate);
        
        const percentGoal = 78; // TODO: Calculer dynamiquement

        setMetrics({
          kmThisMonth,
          nSessions,
          nSessionsPlanned,
          percentSessions,
          progression,
          goalName,
          weeksLeft,
          percentGoal
        });

      } catch (e) {
        if (e instanceof ApiError) {
          setError(e);
        } else {
          setError(new ApiError('An unexpected error occurred', 500, 'Internal Error'));
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { metrics, isLoading, error };
}; 