import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, Announcement, Certificate } from "@/lib/demo-data";

const API_BASE = import.meta.env.VITE_API_URL as string;

export interface LoginHistoryEntry {
  id: string;
  ip: string;
  userAgent: string | null;
  method: "email" | "google";
  createdAt: string;
}

export const useCourses = (token?: string | null) => {
  return useQuery({
    queryKey: ['courses', token ?? null],
    queryFn: async (): Promise<Course[]> => {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/courses`, { headers });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }
  });
};

export const useAnnouncements = (token?: string | null) => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async (): Promise<Announcement[]> => {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/announcements`, { headers });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });
};

export const useCertificates = (token?: string | null) => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<Certificate[]> => {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/certificates`, { headers });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });
};

export const useLoginHistory = (token: string | null) => {
  return useQuery({
    queryKey: ['loginHistory'],
    enabled: !!token,
    queryFn: async (): Promise<LoginHistoryEntry[]> => {
      const res = await fetch(`${API_BASE}/auth/login-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch login history');
      return res.json();
    },
  });
};

export const useMarkTopicComplete = (token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, topicId }: { courseId: string; topicId: string }) => {
      const res = await fetch(
        `${API_BASE}/progress/${courseId}/topics/${topicId}/toggle`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to toggle topic completion');
      return res.json() as Promise<{ courseId: string; completedTopics: string[]; progress: number }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
