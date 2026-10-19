"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { demoUsers, mockMember4Service } from "@/lib/member4/mock-service";
import type { Member4Dashboard, Member4Role, Member4State } from "@/lib/member4/contracts";

const stateLabels: Record<Member4State, string> = {
  loading: "Loading your learning space",
  empty: "Nothing to show yet",
  success: "Live demo data",
  "validation-error": "Check the highlighted fields",
  unauthorized: "Access is restricted",
  "revoked-enrollment": "Enrollment revoked",
  "expired-invitation": "Invitation expired",
};

function formatRole(role: Member4Role) {
  return role === "instructor" ? "Instructor" : "Learner";
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${value}%` } as CSSProperties}>
      <span>{value}%</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-icon">✦</span>
      <h2>Your learning space is ready</h2>
      <p>Enroll in a course or ask an instructor for an invitation to get started.</p>
      <button className="button button-primary" type="button">
        Explore published courses
      </button>
    </div>
  );
}

function LearnerView({ dashboard }: { dashboard: Member4Dashboard }) {
  const activeEnrollment = dashboard.enrollments.find((item) => item.status === "active");
  const revokedEnrollment = dashboard.enrollments.find((item) => item.status === "revoked");
  const activeCourse = dashboard.courses.find((course) => course.id === activeEnrollment?.courseId);

  return (
    <section className="content-grid">
      <div className="main-column">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your learning path</p>
            <h2>Continue learning</h2>
          </div>
          <button className="button button-secondary" type="button">View all courses</button>
        </div>
        {activeEnrollment && activeCourse ? (
          <article className="featured-course">
            <div className="course-art art-blue"><span>AI</span><span>01</span></div>
            <div className="course-copy">
              <div className="tag">In progress</div>
              <h3>{activeCourse.title}</h3>
              <p>{activeCourse.description}</p>
              <div className="course-meta"><span>12 learning units</span><span>•</span><span>{activeEnrollment.activeMinutes} active minutes</span></div>
              <button className="button button-primary" type="button">Continue lesson <span>→</span></button>
            </div>
            <ProgressRing value={activeEnrollment.progress} />
          </article>
        ) : (
          <EmptyState />
        )}

        <div className="section-heading compact">
          <div><p className="eyebrow">Your access</p><h2>Enrollment status</h2></div>
        </div>
        <div className="status-grid">
          {revokedEnrollment && (
            <article className="status-card warning">
              <div className="status-icon">!</div>
              <div><h3>Systems Design Studio</h3><p>Your enrollment was revoked. Your learning history is retained.</p></div>
              <span className="status-pill">Revoked</span>
            </article>
          )}
          {dashboard.invitations.map((invitation) => (
            <article className="status-card muted" key={invitation.id}>
              <div className="status-icon">↗</div>
              <div><h3>{invitation.courseTitle}</h3><p>This invitation expired on {invitation.expiresAt}.</p></div>
              <span className="status-pill">Expired</span>
            </article>
          ))}
        </div>
      </div>
      <aside className="side-column">
        <div className="section-heading"><div><p className="eyebrow">At a glance</p><h2>Your progress</h2></div></div>
        <div className="metric-card"><ProgressRing value={activeEnrollment?.progress ?? 0} /><div><strong>{activeEnrollment?.progress ?? 0}%</strong><span>course progress</span></div></div>
        <div className="metric-list">
          <div><span>Latest score</span><strong>{activeEnrollment?.score ?? "—"}%</strong></div>
          <div><span>Active learning time</span><strong>{activeEnrollment?.activeMinutes ?? 0} min</strong></div>
          <div><span>Completed units</span><strong>{activeEnrollment ? Math.round((activeEnrollment.progress / 100) * (activeCourse?.requiredUnits ?? 0)) : 0}</strong></div>
        </div>
        <div className="tip-card"><span>✦</span><div><strong>Keep your momentum</strong><p>Small, focused sessions help you build a consistent learning habit.</p></div></div>
      </aside>
    </section>
  );
}

function InstructorView({ dashboard }: { dashboard: Member4Dashboard }) {
  const published = dashboard.courses.filter((course) => course.visibility === "published");
  const privateCourses = dashboard.courses.filter((course) => course.visibility === "private");
  return (
    <section className="content-grid">
      <div className="main-column">
        <div className="section-heading"><div><p className="eyebrow">Teaching overview</p><h2>Your courses</h2></div><button className="button button-primary" type="button">Create a course <span>＋</span></button></div>
        <div className="instructor-stats"><div><span>Total learners</span><strong>32</strong><small>Across 2 courses</small></div><div><span>Average progress</span><strong>58%</strong><small className="positive">↑ 8% this month</small></div><div><span>Participation</span><strong>84%</strong><small className="positive">↑ 12% this month</small></div></div>
        <div className="course-list">
          {[...published, ...privateCourses].map((course) => (
            <article className="instructor-course" key={course.id}>
              <div className={`course-art ${course.visibility === "published" ? "art-blue" : "art-purple"}`}><span>{course.visibility === "published" ? "AI" : "SD"}</span></div>
              <div className="instructor-course-copy"><div className="course-title-row"><h3>{course.title}</h3><span className={`status-pill ${course.visibility === "private" ? "private" : ""}`}>{course.visibility}</span></div><p>{course.description}</p><span className="course-meta">{course.learnerCount} learners <span>•</span> {course.requiredUnits} units</span></div>
              <button className="icon-button" type="button" aria-label={`Open ${course.title}`}>→</button>
            </article>
          ))}
        </div>
      </div>
      <aside className="side-column">
        <div className="section-heading"><div><p className="eyebrow">Recent activity</p><h2>Course pulse</h2></div></div>
        <div className="pulse-card"><div className="pulse-number">24</div><div><strong>learners active</strong><p>in the last 7 days</p></div><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className="roster-card"><div className="section-heading compact"><div><p className="eyebrow">Learner roster</p><h2>AI-Assisted SE</h2></div><button className="icon-button" type="button">→</button></div><div className="avatar-row"><span>AW</span><span>JC</span><span>ML</span><span>+21</span></div><p>Invite learners or import your roster to get started.</p><button className="button button-secondary full-width" type="button">Manage roster</button></div>
      </aside>
    </section>
  );
}

export default function Home() {
  const [userId, setUserId] = useState(demoUsers[0].id);
  const [dashboard, setDashboard] = useState<Member4Dashboard | null>(null);
  const [state, setState] = useState<Member4State>("loading");
  const user = useMemo(() => demoUsers.find((item) => item.id === userId) ?? demoUsers[0], [userId]);
  const displayState = dashboard?.user.id === userId ? state : "loading";

  useEffect(() => {
    let active = true;
    mockMember4Service.getDashboard(userId).then((data) => {
      if (active) { setDashboard(data); setState(data.state); }
    }).catch(() => { if (active) setState("unauthorized"); });
    return () => { active = false; };
  }, [userId]);

  return (
    <div className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">◒</span><span>learn<span className="brand-accent">space</span></span></div><nav><a className="active" href="#overview">Overview</a><a href="#courses">My courses</a><a href="#activity">Activity</a></nav><div className="topbar-actions"><button className="notification" type="button" aria-label="Notifications">♧<i /></button><div className="avatar">{user.name.split(" ").map((part) => part[0]).join("")}</div><div className="profile-name"><strong>{user.name}</strong><span>{formatRole(user.role)}</span></div></div></header>
      <main className="page-content">
        <div className="welcome-row"><div><p className="eyebrow">Monday, 19 October 2026</p><h1>Good morning, {user.name.split(" ")[0]} <span>✦</span></h1><p className="subtitle">{user.role === "learner" ? "Pick up where you left off." : "Here is what is happening in your learning community."}</p></div><label className="demo-switcher">Demo view<select value={userId} onChange={(event) => setUserId(event.target.value)}>{demoUsers.map((demoUser) => <option key={demoUser.id} value={demoUser.id}>{formatRole(demoUser.role)}</option>)}</select></label></div>
        <div className={`state-banner state-${displayState}`}><span className="state-dot" />{stateLabels[displayState]}<span className="state-note">Typed Member 4 mock contract</span></div>
        {displayState === "loading" && <div className="loading-card"><span className="loader" />Loading dashboard...</div>}
        {displayState === "unauthorized" && <div className="empty-state"><span className="empty-icon">!</span><h2>Access restricted</h2><p>This demo user is not authorized to view this learning space.</p></div>}
        {dashboard && displayState === "success" && (dashboard.user.role === "learner" ? <LearnerView dashboard={dashboard} /> : <InstructorView dashboard={dashboard} />)}
      </main>
      <footer>Member 4 prototype <span>•</span> Accounts, enrollment, learning records & analytics</footer>
    </div>
  );
}
