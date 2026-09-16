import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import "../../styles/loader.scss";

const STAGES = [
  "Parsing target job requirements...",
  "Analyzing resume & matching competencies...",
  "Synthesizing high-yield technical & behavioral questions...",
  "Formulating customized day-by-day roadmap...",
];

const CinematicLoader = ({ title = "Crafting Your Interview Strategy", subtitle = "Our AI is analyzing requirements to engineer your customized plan." }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cinematic-loader">
      <div className="cinematic-loader__card">
        {/* Animated Orb */}
        <div className="cinematic-loader__orb">
          <Sparkles size={34} />
        </div>

        {/* Text */}
        <div className="cinematic-loader__content">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="cinematic-loader__progress-track">
          <div className="cinematic-loader__progress-bar" />
        </div>

        {/* Dynamic Stages List */}
        <div className="cinematic-loader__stages">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isActive = idx === currentStage;
            return (
              <div
                key={idx}
                className={`cinematic-loader__stage-item ${
                  isDone
                    ? "cinematic-loader__stage-item--done"
                    : isActive
                      ? "cinematic-loader__stage-item--active"
                      : ""
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : isActive ? (
                  <Loader2 size={16} className="spin-icon" style={{ animation: "spin 1.2s linear infinite" }} />
                ) : (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      marginLeft: 5,
                      marginRight: 5,
                    }}
                  />
                )}
                <span>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CinematicLoader;
