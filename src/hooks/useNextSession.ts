import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import apiClient, { ApiError } from '@/lib/api';

export interface NextSession {
  id: number;
  day: string;
  date: string;
  sessionType: string;
  title: string;
  description: string;
  details: string;
  duration_min: number;
  distance_km: number;
  intensity: number;
  rpe: number;
}

export const useNextSession = () => {
  const { token } = useAuth();
  const [session, setSession] = useState<NextSession | null>(null);
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
        const nextSessionData = await apiClient<NextSession>('/api/training/next');
        setSession(nextSessionData);
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

  return { session, isLoading, error };
}; 