import { AppLayout } from "@/components/AppLayout";
import { useAnnouncements, useMarkAnnouncementRead, useSuspiciousLoginCheck } from "@/hooks/use-courses";
import { Megaphone, ShieldAlert, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Announcements = () => {
  const { token } = useAuth();
  const { data: announcements = [] } = useAnnouncements(token);
  const markRead = useMarkAnnouncementRead(token);
  const { data: suspiciousData } = useSuspiciousLoginCheck(token);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const unread = announcements.filter((a) => !a.isRead);
  const read   = announcements.filter((a) => a.isRead);

  const handleRead = (id: string, isAlreadyRead?: boolean) => {
    if (!isAlreadyRead) markRead.mutate(id);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        {/* Suspicious login alert */}
        {suspiciousData?.isNewDevice && !dismissedAlert && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">New sign-in detected</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your account was accessed from a new IP address
                {suspiciousData.ip ? ` (${suspiciousData.ip})` : ""}. If this wasn't you, change your password immediately.
              </p>
            </div>
            <button
              onClick={() => setDismissedAlert(true)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 shrink-0"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Announcements</h1>
            <p className="mt-1 text-sm text-muted-foreground">Platform updates and news</p>
          </div>
          {unread.length > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground px-1.5">
              {unread.length} new
            </span>
          )}
        </div>

        {announcements.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            No announcements yet.
          </div>
        )}

        {/* Unread */}
        {unread.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unread</h2>
            {unread.map((a) => (
              <button
                key={a.id}
                onClick={() => handleRead(a.id, false)}
                className="w-full text-left rounded-xl border border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-semibold text-foreground">{a.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{a.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to mark as read →
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Read */}
        {read.length > 0 && (
          <div className="space-y-3">
            {unread.length > 0 && (
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earlier</h2>
            )}
            {read.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "rounded-xl border border-border bg-card p-5 opacity-70",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-medium text-muted-foreground">{a.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{a.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Announcements;
