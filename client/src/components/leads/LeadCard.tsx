import { Link } from "react-router";
import { Mail, Phone, Calendar, ArrowRight, Trash2 } from "lucide-react";
import type { Lead } from "../../types/lead";
import StatusBadge from "../StatusBadge";

interface LeadCardProps {
  lead: Lead;
  onDelete: (lead: Lead) => void;
}

export default function LeadCard({ lead, onDelete }: LeadCardProps) {
  const initials = lead.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const createdDate = new Date(lead.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="lead-card">
      {/* Card Header */}
      <div className="lead-card-header">
        <div className="lead-card-avatar">{initials || "L"}</div>
        <div className="lead-card-identity">
          <Link to={`/leads/${lead.id}`} className="lead-card-name">
            {lead.name}
          </Link>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {/* Contact Info */}
      <div className="lead-card-body">
        <div className="lead-card-meta-row">
          <Mail size={13} strokeWidth={2} className="lead-card-meta-icon" />
          <a href={`mailto:${lead.email}`} className="lead-card-meta-value lead-card-link">
            {lead.email}
          </a>
        </div>
        <div className="lead-card-meta-row">
          <Phone size={13} strokeWidth={2} className="lead-card-meta-icon" />
          <a href={`tel:${lead.phone}`} className="lead-card-meta-value lead-card-link">
            {lead.phone}
          </a>
        </div>
        <div className="lead-card-meta-row">
          <Calendar size={13} strokeWidth={2} className="lead-card-meta-icon" />
          <span className="lead-card-meta-value">{createdDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="lead-card-footer">
        <button
          type="button"
          className="lead-card-delete-btn"
          onClick={() => onDelete(lead)}
          title="Delete lead"
        >
          <Trash2 size={14} strokeWidth={2} />
          Delete
        </button>
        <Link to={`/leads/${lead.id}`} className="lead-card-view-btn">
          View Details
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
