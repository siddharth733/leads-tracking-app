import { Link } from "react-router";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import type { Lead } from "../../types/lead";
import StatusBadge from "../StatusBadge";

interface LeadHeaderProps {
  lead: Lead;
  deleting: boolean;
  onDelete: () => void;
}

export default function LeadHeader({
  lead,
  deleting,
  onDelete,
}: LeadHeaderProps) {
  // Extract initials for avatar badge
  const initials = lead.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="card detail-header-hero">
      <div className="breadcrumb-nav">
        <Link to="/leads" className="back-link">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Pipeline
        </Link>
      </div>

      <div className="hero-content-row">
        <div className="hero-profile-group">
          <div className="lead-avatar-lg">{initials || "L"}</div>

          <div className="hero-lead-info">
            <div className="hero-title-row">
              <h1 className="hero-lead-name">{lead.name}</h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="hero-lead-meta">
              Registered on{" "}
              {new Date(lead.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="hero-actions-group">
          <a
            href={`mailto:${lead.email}`}
            className="button button-secondary button-sm"
          >
            <Mail size={15} strokeWidth={2} />
            Email Lead
          </a>

          <a
            href={`tel:${lead.phone}`}
            className="button button-secondary button-sm"
          >
            <Phone size={15} strokeWidth={2} />
            Call Lead
          </a>

          <button
            type="button"
            className="button button-danger button-sm"
            onClick={onDelete}
            disabled={deleting}
          >
            <Trash2 size={15} strokeWidth={2} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
