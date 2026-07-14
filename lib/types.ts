export type Course = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  format: string;
  durationHours: number;
  priceNaira: number;
  subsidiaries: string;
  initiative: number | null;
  videoUrl: string | null;
  imageUrl: string | null;
  authorId: string | null;
  isBriefing: boolean | null;
  customContent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Enrollment = {
  id: number;
  userId: string;
  courseId: number;
  status: "enrolled" | "in_progress" | "completed";
  progress: number;
  enrolledAt: Date;
  completedAt: Date | null;
}

export type QuizAttempt = {
  id: number;
  userId: string;
  courseId: number;
  score: number;
  total: number;
  passed: boolean;
  answers: string | null;
  createdAt: Date;
}

export type Certificate = {
  id: number;
  userId: string;
  courseId: number;
  serial: string;
  issuedAt: Date;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  subsidiary: string | null;
  mustChangePassword?: boolean;
  createdAt: Date;
}
