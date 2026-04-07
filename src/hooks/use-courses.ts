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

// ── Announcement helpers ──────────────────────────────────────────────────────

export const useUnreadAnnouncementsCount = (token: string | null) => {
  return useQuery({
    queryKey: ['unread-announcements'],
    enabled: !!token,
    refetchInterval: 60_000, // refresh every 60 s
    queryFn: async (): Promise<{ count: number }> => {
      const res = await fetch(`${API_BASE}/announcements/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { count: 0 };
      return res.json();
    },
  });
};

export const useMarkAnnouncementRead = (token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (announcementId: string) => {
      const res = await fetch(`${API_BASE}/announcements/${announcementId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to mark announcement as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['unread-announcements'] });
    },
  });
};

// ── Suspicious login check ────────────────────────────────────────────────────

export interface SuspiciousCheckResult {
  isNewDevice: boolean;
  ip?: string;
  method?: string;
  createdAt?: string;
}

export const useSuspiciousLoginCheck = (token: string | null) => {
  return useQuery({
    queryKey: ['suspicious-check'],
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SuspiciousCheckResult> => {
      const res = await fetch(`${API_BASE}/auth/suspicious-check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { isNewDevice: false };
      return res.json();
    },
  });
};
