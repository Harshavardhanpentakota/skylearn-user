export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  lessonsCount: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  videoUrl?: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  completionDate: string;
}


