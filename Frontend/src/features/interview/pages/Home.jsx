import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import Navbar from "../../../components/common/Navbar";
import CinematicLoader from "../../../components/common/CinematicLoader";
import {
  Briefcase,
  User,
  UploadCloud,
  FileText,
  X,
  Sparkles,
  Clock,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  FolderSearch,
} from "lucide-react";
import "../style/home.scss";

const SAMPLE_JD = `Role: Senior Full Stack Engineer
Key Responsibilities:
- Design, build, and maintain scalable web applications using React, TypeScript, and Node.js.
- Architect high-throughput REST and GraphQL APIs backed by PostgreSQL and MongoDB.
- Drive technical direction, lead code reviews, and mentor mid-level software engineers.
- Collaborate with product designers and engineering managers to ship performant user experiences.
Requirements:
- 4+ years of professional full-stack development experience.
- Strong proficiency in modern React, state management, and CSS architecture.
- Hands-on expertise with distributed systems, Docker, and CI/CD deployment pipelines.`;

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState("");
  const resumeInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file extension
      const validTypes = [".pdf", ".docx"];
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (validTypes.includes(fileExt)) {
        setSelectedFile(file);
        setValidationError("");
      } else {
        setValidationError("Please upload a valid PDF or DOCX file.");
      }
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleGenerateReport = async () => {
    setValidationError("");

    if (!jobDescription.trim()) {
      setValidationError("Please provide the target job description.");
      return;
    }

    const fileToUpload = selectedFile || resumeInputRef.current?.files?.[0];
    if (!fileToUpload) {
      setValidationError("Please upload your resume (PDF or DOCX) to analyze your fit.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: fileToUpload,
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      } else {
        setValidationError("Could not generate interview plan. Please verify the resume format and try again.");
      }
    } catch (err) {
      console.error(err);
      setValidationError("Failed to generate plan. Please ensure the backend is available and try again.");
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
        <CinematicLoader
          title="Analyzing Profile &amp; Role"
          subtitle="Skillens AI is evaluating competencies, crafting tailored interview questions, and architecting your prep roadmap."
        />
      </div>
    );
  }

  const jdCharCount = jobDescription.length;
  const counterPct = Math.min(100, Math.round((jdCharCount / 5000) * 100));

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__main">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero__badge">
            <Sparkles size={14} />
            <span>AI-Powered Career Intelligence</span>
          </div>

          <h1>
            Create Your Custom <span className="highlight">Interview Strategy</span>
          </h1>
          <p>
            Match your background against target roles. Uncover critical skill gaps, practice tailored questions, and follow an actionable prep roadmap.
          </p>
        </section>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="alert alert--danger" style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Studio Card */}
        <section className="studio-card">
          <div className="studio-card__body">
            {/* Left Panel - Job Description */}
            <div className="studio-card__panel studio-card__panel--left">
              <div className="studio-card__panel-header">
                <div className="header-title-group">
                  <div className="header-icon">
                    <Briefcase size={17} />
                  </div>
                  <h2>Target Job Description</h2>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => setJobDescription(SAMPLE_JD)}
                    title="Paste an example job description"
                  >
                    Paste Example
                  </button>
                  <span className="badge badge--primary">Required</span>
                </div>
              </div>

              <div className="studio-card__textarea-container">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here...&#10;&#10;e.g. 'Senior Frontend Engineer requires proficiency in React, TypeScript, state management, and large-scale system architecture...'"
                  maxLength={5000}
                />
                <div className="studio-card__counter-bar">
                  <span>{jdCharCount} / 5000 characters</span>
                  <div className="counter-progress">
                    <div
                      className="counter-fill"
                      style={{ width: `${counterPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Profile & Resume */}
            <div className="studio-card__panel studio-card__panel--right">
              <div className="studio-card__panel-header">
                <div className="header-title-group">
                  <div className="header-icon">
                    <User size={17} />
                  </div>
                  <h2>Your Candidate Profile</h2>
                </div>
                <span className="badge badge--success">Best Results</span>
              </div>

              {/* Resume Uploader / Preview */}
              {!selectedFile ? (
                <label
                  className={`studio-card__dropzone ${isDragOver ? "studio-card__dropzone--dragover" : ""}`}
                  htmlFor="resume"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="dropzone-icon">
                    <UploadCloud size={24} />
                  </div>
                  <p className="dropzone-title">Click to upload or drag &amp; drop</p>
                  <p className="dropzone-subtitle">PDF or DOCX document (Max 5MB)</p>
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="studio-card__file-preview">
                  <div className="file-info">
                    <div className="file-icon">
                      <FileText size={20} />
                    </div>
                    <div className="file-details">
                      <span className="file-name" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <span className="file-meta">
                        {formatFileSize(selectedFile.size)} &bull; Ready for analysis
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={handleRemoveFile}
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Quick Self-Description */}
              <div className="studio-card__self-description">
                <label htmlFor="selfDescription">
                  Additional Notes or Self-Description (Optional)
                </label>
                <textarea
                  id="selfDescription"
                  name="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Mention years of experience, specific frameworks, achievements, or goals you want emphasized..."
                />
              </div>

              {/* Tip Box */}
              <div className="studio-card__tip-box">
                <Lightbulb size={17} />
                <p>
                  Uploading a complete resume yields the most accurate match score, custom interview scenarios, and targeted roadmap.
                </p>
              </div>
            </div>
          </div>

          {/* Studio Footer Bar */}
          <div className="studio-card__footer">
            <div className="footer-left">
              <Clock size={16} />
              <span>AI Analysis takes approximately 20–30 seconds</span>
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              className="btn btn--primary btn--lg"
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>Generate My Interview Strategy</span>
            </button>
          </div>
        </section>

        {/* Recent Plans Section */}
        <section className="recent-plans">
          <div className="recent-plans__header">
            <h2>Saved Interview Plans</h2>
            {reports && reports.length > 0 && (
              <span className="badge badge--neutral">
                {reports.length} {reports.length === 1 ? "Plan" : "Plans"}
              </span>
            )}
          </div>

          {reports && reports.length > 0 ? (
            <div className="recent-plans__grid">
              {reports.map((report) => {
                const score = report.matchScore ?? 0;
                const scoreBadgeClass =
                  score >= 80
                    ? "badge--success"
                    : score >= 60
                      ? "badge--warning"
                      : "badge--danger";

                return (
                  <div
                    key={report._id}
                    className="recent-plans__card"
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    <div className="card-top">
                      <h3>{report.title || "Untitled Position"}</h3>
                      <span className="card-date">
                        Created on {new Date(report.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="card-bottom">
                      <span className={`badge ${scoreBadgeClass}`}>
                        {score}% Match
                      </span>
                      <span className="view-cta">
                        <span>View Strategy</span>
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="recent-plans__empty">
              <div className="empty-icon">
                <FolderSearch size={26} />
              </div>
              <h3>No interview plans yet</h3>
              <p>
                Paste a target job description and upload your resume above to generate your first tailored interview plan and preparation roadmap.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Page Footer */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <p>&copy; {new Date().getFullYear()} Skillens. AI-Powered Interview Intelligence.</p>
          <div className="footer-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#help" onClick={(e) => e.preventDefault()}>Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
