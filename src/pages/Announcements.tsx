import { AppLayout } from "@/components/AppLayout";
import { useAnnouncements } from "@/hooks/use-courses";
import { Megaphone } from "lucide-react";

const Announcements = () => {
  const { data: announcements = [] } = useAnnouncements();

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Announcements</h1>
          <p className="mt-1 text-muted-foreground">Platform updates and news</p>
        </div>

        <div className="grid gap-4">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading font-semibold text-card-foreground">{a.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">{a.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Announcements;
