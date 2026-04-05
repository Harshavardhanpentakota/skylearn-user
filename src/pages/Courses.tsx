import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Courses = () => {
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const { data: courses, isLoading } = useCourses(token);

  const filtered = (courses || []).filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Loading courses...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Browse all available courses</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;
