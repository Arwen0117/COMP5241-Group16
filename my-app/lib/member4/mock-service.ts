import type {
  Enrollment,
  Invitation,
  Member4Course,
  Member4Dashboard,
  Member4Service,
  Member4User,
} from "./contracts";

const instructor: Member4User = {
  id: "user-instructor",
  name: "Dr. Maya Chen",
  email: "maya.chen@polyu.edu.hk",
  role: "instructor",
};

const learner: Member4User = {
  id: "user-learner",
  name: "Alex Wong",
  email: "alex.wong@connect.polyu.hk",
  role: "learner",
};

const courses: Member4Course[] = [
  {
    id: "course-ai-engineering",
    title: "AI-Assisted Software Engineering",
    description: "Build reliable development workflows with modern AI tools.",
    visibility: "published",
    ownerId: instructor.id,
    learnerCount: 24,
    requiredUnits: 12,
  },
  {
    id: "course-systems-design",
    title: "Systems Design Studio",
    description: "A private instructor-led course for the next teaching cohort.",
    visibility: "private",
    ownerId: instructor.id,
    learnerCount: 8,
    requiredUnits: 10,
  },
];

const learnerEnrollments: Enrollment[] = [
  {
    id: "enrollment-active",
    courseId: "course-ai-engineering",
    learnerId: learner.id,
    status: "active",
    progress: 67,
    score: 86,
    activeMinutes: 148,
  },
  {
    id: "enrollment-revoked",
    courseId: "course-systems-design",
    learnerId: learner.id,
    status: "revoked",
    progress: 30,
    score: 72,
    activeMinutes: 54,
  },
];

const invitations: Invitation[] = [
  {
    id: "invitation-expired",
    courseId: "course-systems-design",
    courseTitle: "Systems Design Studio",
    status: "expired",
    expiresAt: "15 Oct 2026",
  },
];

const users = new Map<string, Member4User>([
  [instructor.id, instructor],
  [learner.id, learner],
]);

function dashboardFor(user: Member4User): Member4Dashboard {
  if (user.role === "instructor") {
    return {
      user,
      courses,
      enrollments: [],
      invitations: [],
      state: "success",
    };
  }

  return {
    user,
    courses: courses.filter((course) => course.visibility === "published"),
    enrollments: learnerEnrollments,
    invitations,
    state: "success",
  };
}

export const mockMember4Service: Member4Service = {
  async getDashboard(userId) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const user = users.get(userId);
    if (!user) {
      throw new Error("The requested user is not authorized.");
    }
    return dashboardFor(user);
  },

  async switchDemoUser(userId) {
    return this.getDashboard(userId);
  },
};

export const demoUsers = [learner, instructor];
