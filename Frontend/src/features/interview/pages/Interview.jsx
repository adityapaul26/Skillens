import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import Navbar from "../../../components/common/Navbar";
import CinematicLoader from "../../../components/common/CinematicLoader";
import {
  Code2,
  MessageSquare,
  Map,
  FileDown,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Loader2,
  Layers,
} from "lucide-react";
import "../style/interview.scss";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: Code2,
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: MessageSquare,
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: Map,
  },
];

// ── Question Card Component ──────────────────────────────────────────────────
const QuestionCard = ({ item, index, isForceOpen }) => {
  const [userToggled, setUserToggled] = useState(null);
  const [copied, setCopied] = useState(false);

  const open = isForceOpen !== null ? isForceOpen : (userToggled ?? false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Question: ${item.question}\n\nModel Answer:\n${item.answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`q-card ${open ? "q-card--expanded" : ""}`}>
      <div className="q-card__header" onClick={() => setUserToggled(!open)}>
        <div className="q-card__title-group">
          <span className="q-badge">Q{index + 1}</span>
          <p className="q-text">{item.question}</p>
        </div>
        <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`}>
          <ChevronDown size={18} />
        </span>
      </div>

      {open && (
        <div className="q-card__body">
          {item.intention && (
            <div className="q-card__section">
              <span className="tag-label tag-label--intention">
                Evaluation Objective
              </span>
              <div className="section-content-box">{item.intention}</div>
            </div>
          )}

          {item.answer && (
            <div className="q-card__section">
              <div className="section-header-line">
                <span className="tag-label tag-label--answer">
                  Model Answer
                </span>
                <button
                  type="button"
                  className={`copy-btn ${copied ? "copy-btn--copied" : ""}`}
                  onClick={handleCopy}
                  title="Copy question and answer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Answer"}</span>
                </button>
              </div>
              <div className="section-content-box">{item.answer}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Radial Match Score Gauge ─────────────────────────────────────────────────
const RadialScoreGauge = ({ score }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = "#10b981"; // high
  let badgeClass = "badge--success";
  let label = "Strong Match";
  let note = "Your profile demonstrates strong alignment with core role specifications.";

  if (safeScore < 60) {
    strokeColor = "#f43f5e"; // low
    badgeClass = "badge--danger";
    label = "Needs Preparation";
    note = "Critical skill gaps identified. Focus heavily on the targeted prep roadmap.";
  } else if (safeScore < 80) {
    strokeColor = "#f59e0b"; // mid
    badgeClass = "badge--warning";
    label = "Moderate Alignment";
    note = "Solid foundational skills. Refine key technical areas outlined below.";
  }

  return (
    <div className="match-gauge">
      <div className="match-gauge__circle-wrapper">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="match-gauge__score-content">
          <span className="score-number" style={{ color: strokeColor }}>
            {safeScore}
          </span>
          <span className="score-pct">out of 100</span>
        </div>
      </div>

      <div className="match-gauge__assessment">
        <span className={`assessment-badge badge ${badgeClass}`}>
          {label}
        </span>
        <p className="assessment-note">{note}</p>
      </div>
    </div>
  );
};

// ── Roadmap Day Component ────────────────────────────────────────────────────
const RoadMapDay = ({ day, completedTasks, onToggleTask }) => {
  return (
    <div className="roadmap-card">
      <div className="roadmap-card__header">
        <span className="day-pill">Day {day.day}</span>
        <h3>{day.focus}</h3>
      </div>
      <div className="roadmap-card__tasks">
        {day.tasks.map((task, idx) => {
          const taskId = `${day.day}_${idx}`;
          const isDone = !!completedTasks[taskId];

          return (
            <div
              key={idx}
              className={`task-item ${isDone ? "task-item--completed" : ""}`}
              onClick={() => onToggleTask(taskId)}
            >
              <span className="task-checkbox">
                {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </span>
              <span className="task-label">{task}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Interview Component ──────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const [searchQuery, setSearchQuery] = useState("");
  const [isForceOpen, setIsForceOpen] = useState(null);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);

  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  const [completedTasks, setCompletedTasks] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(`skillens_tasks_${interviewId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const handleToggleTask = (taskId) => {
    const updated = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId],
    };
    setCompletedTasks(updated);
    try {
      localStorage.setItem(`skillens_tasks_${interviewId}`, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save task progress:", e);
    }
  };

  const handleDownloadResume = async () => {
    setIsDownloadingResume(true);
    try {
      await getResumePdf(interviewId);
    } catch (err) {
      console.error("Failed to download resume:", err);
    } finally {
      setIsDownloadingResume(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="interview-page">
        <Navbar />
        <CinematicLoader
          title="Retrieving Interview Plan"
          subtitle="Loading your personalized questions, skill gap analysis, and roadmap."
        />
      </div>
    );
  }

  // Filter questions based on search query
  const filterQuestions = (questions = []) => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.toLowerCase();
    return questions.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.intention?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q)
    );
  };

  const technicalFiltered = filterQuestions(report.technicalQuestions || []);
  const behavioralFiltered = filterQuestions(report.behavioralQuestions || []);

  // Compute roadmap completion percentage
  const totalTasks = (report.preparationPlan || []).reduce(
    (acc, day) => acc + (day.tasks?.length || 0),
    0
  );
  const finishedTasksCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = totalTasks > 0 ? Math.round((finishedTasksCount / totalTasks) * 100) : 0;

  // Categorize skill gaps
  const skillGaps = report.skillGaps || [];
  const highGaps = skillGaps.filter((g) => g.severity === "high");
  const medGaps = skillGaps.filter((g) => g.severity === "medium");
  const lowGaps = skillGaps.filter((g) => g.severity === "low");

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="interview-page">
      <Navbar />

      {/* Sub-Header with Breadcrumbs and Resume Action */}
      <div className="interview-page__sub-header">
        <div className="sub-header-inner">
          <div className="breadcrumb-group">
            <div className="breadcrumbs">
              <Link to="/">Dashboard</Link>
              <ChevronRight size={14} className="separator" />
              <span className="current">{report.title || "Interview Strategy"}</span>
            </div>
            <h1 className="role-title">
              {report.title || "Custom Interview Strategy"}
              <span className="date-badge">
                <Calendar size={13} style={{ marginRight: 4, display: "inline" }} />
                {formattedDate}
              </span>
            </h1>
          </div>

          <button
            type="button"
            onClick={handleDownloadResume}
            className="btn btn--primary"
            disabled={isDownloadingResume}
          >
            {isDownloadingResume ? (
              <>
                <Loader2 size={16} className="spin-icon" style={{ animation: "spin 1s linear infinite" }} />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown size={16} />
                <span>Download Tailored Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="interview-page__workspace">
        {/* Mobile Navigation Tabs */}
        <div className="mobile-nav-tabs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const count =
              item.id === "technical"
                ? report.technicalQuestions?.length
                : item.id === "behavioral"
                  ? report.behavioralQuestions?.length
                  : `${report.preparationPlan?.length || 0}d`;

            return (
              <button
                key={item.id}
                className={`tab-btn ${activeNav === item.id ? "tab-btn--active" : ""}`}
                onClick={() => {
                  setActiveNav(item.id);
                  setSearchQuery("");
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                <span className="badge badge--neutral" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Desktop Left Nav ── */}
        <aside className="interview-nav">
          <span className="interview-nav__section-title">Sections</span>
          <div className="interview-nav__items">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const count =
                item.id === "technical"
                  ? report.technicalQuestions?.length
                  : item.id === "behavioral"
                    ? report.behavioralQuestions?.length
                    : `${report.preparationPlan?.length || 0} days`;

              return (
                <button
                  key={item.id}
                  className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                  onClick={() => {
                    setActiveNav(item.id);
                    setSearchQuery("");
                  }}
                >
                  <div className="item-left">
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </div>
                  <span className="item-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="interview-nav__resume-box">
            <span className="resume-box-text">
              Skillens generated a customized resume tailored specifically to match this target position.
            </span>
            <button
              type="button"
              onClick={handleDownloadResume}
              className="btn btn--outline btn--sm"
              disabled={isDownloadingResume}
              style={{ width: "100%" }}
            >
              <FileDown size={14} />
              <span>Export PDF Resume</span>
            </button>
          </div>
        </aside>

        {/* ── Center Content ── */}
        <main className="interview-content">
          {/* Controls Bar for Questions */}
          {activeNav !== "roadmap" && (
            <div className="interview-content__controls">
              <div className="search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toggle-group">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setIsForceOpen(true)}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setIsForceOpen(false)}
                >
                  Collapse All
                </button>
              </div>
            </div>
          )}

          {/* Technical Section */}
          {activeNav === "technical" && (
            <section className="q-list">
              {technicalFiltered.length > 0 ? (
                technicalFiltered.map((q, i) => (
                  <QuestionCard
                    key={i}
                    item={q}
                    index={i}
                    isForceOpen={isForceOpen}
                  />
                ))
              ) : (
                <div className="empty-search" style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
                  <p>No technical questions match &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </section>
          )}

          {/* Behavioral Section */}
          {activeNav === "behavioral" && (
            <section className="q-list">
              {behavioralFiltered.length > 0 ? (
                behavioralFiltered.map((q, i) => (
                  <QuestionCard
                    key={i}
                    item={q}
                    index={i}
                    isForceOpen={isForceOpen}
                  />
                ))
              ) : (
                <div className="empty-search" style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
                  <p>No behavioral questions match &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </section>
          )}

          {/* Road Map Section */}
          {activeNav === "roadmap" && (
            <div className="roadmap-container">
              {/* Progress Tracker Card */}
              <div className="roadmap-container__progress">
                <div className="progress-header">
                  <strong>Preparation Progress</strong>
                  <span>
                    {finishedTasksCount} of {totalTasks} tasks ({progressPct}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="roadmap-container__timeline">
                {(report.preparationPlan || []).map((day) => (
                  <RoadMapDay
                    key={day.day}
                    day={day}
                    completedTasks={completedTasks}
                    onToggleTask={handleToggleTask}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="interview-sidebar">
          {/* Match Score Card */}
          <div className="interview-sidebar__card">
            <span className="interview-sidebar__title">Role Match Score</span>
            <RadialScoreGauge score={report.matchScore} />
          </div>

          {/* Skill Gaps Card */}
          <div className="interview-sidebar__card">
            <span className="interview-sidebar__title">Identified Skill Gaps</span>
            <div className="skill-gaps-container">
              {skillGaps.length === 0 ? (
                <div className="empty-gaps">
                  <CheckCircle2 size={16} />
                  <span>No skill gaps detected! Outstanding fit.</span>
                </div>
              ) : (
                <>
                  {highGaps.length > 0 && (
                    <div className="gap-category">
                      <span className="category-label">
                        <AlertTriangle size={12} style={{ color: "#f43f5e" }} />
                        High Priority
                      </span>
                      <div className="tags-wrap">
                        {highGaps.map((gap, i) => (
                          <span key={i} className="gap-tag gap-tag--high">
                            {gap.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {medGaps.length > 0 && (
                    <div className="gap-category">
                      <span className="category-label">
                        <TrendingUp size={12} style={{ color: "#f59e0b" }} />
                        Moderate Priority
                      </span>
                      <div className="tags-wrap">
                        {medGaps.map((gap, i) => (
                          <span key={i} className="gap-tag gap-tag--medium">
                            {gap.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {lowGaps.length > 0 && (
                    <div className="gap-category">
                      <span className="category-label">
                        <Layers size={12} style={{ color: "#10b981" }} />
                        Foundational
                      </span>
                      <div className="tags-wrap">
                        {lowGaps.map((gap, i) => (
                          <span key={i} className="gap-tag gap-tag--low">
                            {gap.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
