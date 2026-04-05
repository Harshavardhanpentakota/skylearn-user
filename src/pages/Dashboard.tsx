import { AppLayout } from "@/components/AppLayout";
import { CourseCard } from "@/components/CourseCard";
import { useCourses, useCertificates } from "@/hooks/use-courses";
import { BookOpen, CheckCircle, Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user, token } = useAuth();
  const { data: courses = [], isLoading } = useCourses(token);
  const { data: certificates = [] } = useCertificates(token);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const stats = [
    { icon: BookOpen, label: "My Courses", value: String(courses.length || "5") },
    { icon: CheckCircle, label: "Completed Lessons", value: "14" },
    { icon: Award, label: "Certificates", value: String(certificates.length) },
    { icon: TrendingUp, label: "Learning Progress", value: "42%" },
  ];
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 text-muted-foreground">Continue your learning journey.</p>
          <Progress value={42} className="mt-4 h-2 max-w-xs" />
          <p className="mt-2 text-xs text-muted-foreground">Overall progress: 42%</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-heading font-bold text-card-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Continue Learning */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-muted-foreground text-sm col-span-full">Loading courses...</p>
            ) : (
              courses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} actionLabel="Continue Learning" />
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
