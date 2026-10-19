export type Member4Role = "learner" | "instructor";

export type EnrollmentStatus = "active" | "revoked";

export type CourseVisibility = "published" | "private";

export type InvitationStatus = "active" | "expired" | "revoked";

export type Member4State =
  | "loading"
  | "empty"
  | "success"
  | "validation-error"
  | "unauthorized"
  | "revoked-enrollment"
  | "expired-invitation";

export type LearningEventType =
  | "lesson_completed"
  | "activity_completed"
  | "activity_attempted"
  | "active_time";

export type Member4User = {
  id: string;
  name: string;
  email: string;
  role: Member4Role;
};

export type Member4Course = {
  id: string;
  title: string;
  description: string;
  visibility: CourseVisibility;
  ownerId: string;
  learnerCount: number;
  requiredUnits: number;
};

export type Enrollment = {
  id: string;
  courseId: string;
  learnerId: string;
  status: EnrollmentStatus;
  progress: number;
  score: number | null;
  activeMinutes: number;
};

export type Invitation = {
  id: string;
  courseId: string;
  courseTitle: string;
  status: InvitationStatus;
  expiresAt: string;
};

export type Member4Dashboard = {
  user: Member4User;
  courses: Member4Course[];
  enrollments: Enrollment[];
  invitations: Invitation[];
  state: Member4State;
};

export interface Member4Service {
  getDashboard(userId: string): Promise<Member4Dashboard>;
  switchDemoUser(userId: string): Promise<Member4Dashboard>;
}
