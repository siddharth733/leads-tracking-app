import { Check } from "lucide-react";
import type { LeadStatus } from "../../types/lead";

interface LeadStatusCardProps {
  currentStatus: LeadStatus;
  statuses: LeadStatus[];
  statusLoading: boolean;
  onStatusChange: (status: LeadStatus) => void;
}

export default function LeadStatusCard({
  currentStatus,
  statuses,
  statusLoading,
  onStatusChange,
}: LeadStatusCardProps) {
  const stageLabels: Record<LeadStatus, { label: string; desc: string }> = {
    new: { label: "New Lead", desc: "Fresh lead captured" },
    contacted: { label: "Contacted", desc: "Initial outreach made" },
    qualified: { label: "Qualified", desc: "Sales opportunity validated" },
    lost: { label: "Lost", desc: "Lead closed / archived" },
  };

  const currentStepIndex = statuses.indexOf(currentStatus);

  return (
    <div className="card pipeline-stepper-card">
      <div className="pipeline-stepper-header">
        <div>
          <h3 className="card-subtitle">Pipeline Lifecycle Progress</h3>
          <p className="card-desc">Click any stage pill to update the lead's progress in real-time.</p>
        </div>
        {statusLoading && <span className="updating-spinner-pill">Updating Stage...</span>}
      </div>

      <div className="pipeline-stepper-grid">
        {statuses.map((status, index) => {
          const isCurrent = status === currentStatus;
          const isPassed = index < currentStepIndex && currentStatus !== "lost";
          const isLost = status === "lost";

          let stepStateClass = "";
          if (isCurrent) {
            stepStateClass = isLost ? "step-active-lost" : "step-active";
          } else if (isPassed) {
            stepStateClass = "step-completed";
          }

          return (
            <button
              key={status}
              type="button"
              disabled={statusLoading}
              onClick={() => onStatusChange(status)}
              className={`pipeline-step-pill ${stepStateClass}`}
            >
              <div className="step-indicator">
                {isPassed ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              <div className="step-text-content">
                <span className="step-label">{stageLabels[status]?.label || status}</span>
                <span className="step-desc">{stageLabels[status]?.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
