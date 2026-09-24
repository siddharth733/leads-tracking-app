import { useState } from "react";
import { UserCheck, Copy, PieChart } from "lucide-react";
import type { Lead } from "../../types/lead";
import StatusBadge from "../StatusBadge";

interface LeadSidebarProps {
  lead: Lead;
  noteCount: number;
}

export default function LeadSidebar({ lead, noteCount }: LeadSidebarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(lead.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createdDate = new Date(lead.createdAt);
  const now = new Date();
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)),
  );

  return (
    <aside className="lead-detail-sidebar">
      {/* Contact Details Card */}
      <div className="card sidebar-card">
        <h3 className="sidebar-card-title">
          <UserCheck className="sidebar-title-icon" size={18} strokeWidth={2.2} />
          Contact Details
        </h3>

        <div className="sidebar-contact-list">
          {/* Email */}
          <div className="sidebar-contact-item">
            <span className="sidebar-label">Email Address</span>
            <div className="sidebar-value-row">
              <a href={`mailto:${lead.email}`} className="sidebar-link truncate">
                {lead.email}
              </a>
              <button
                type="button"
                className="icon-button-ghost"
                onClick={handleCopyEmail}
                title="Copy Email"
              >
                {copied ? (
                  <span className="copy-success-text">Copied!</span>
                ) : (
                  <Copy size={15} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="sidebar-contact-item">
            <span className="sidebar-label">Phone Number</span>
            <div className="sidebar-value-row">
              <a href={`tel:${lead.phone}`} className="sidebar-link">
                {lead.phone}
              </a>
            </div>
          </div>

          {/* Date Created */}
          <div className="sidebar-contact-item">
            <span className="sidebar-label">Created Date</span>
            <span className="sidebar-text-value">
              {createdDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              <span className="text-muted-inline"> ({diffDays === 0 ? "Today" : `${diffDays}d ago`})</span>
            </span>
          </div>

          {/* Lead Reference ID */}
          <div className="sidebar-contact-item">
            <span className="sidebar-label">System Ref</span>
            <span className="sidebar-code-value">LEAD-#{lead.id.toString().padStart(4, "0")}</span>
          </div>
        </div>
      </div>

      {/* Pipeline & Activity Overview Card */}
      <div className="card sidebar-card">
        <h3 className="sidebar-card-title">
          <PieChart className="sidebar-title-icon" size={18} strokeWidth={2.2} />
          Lead Summary
        </h3>

        <div className="sidebar-stats-grid">
          <div className="sidebar-stat-box">
            <span className="sidebar-stat-label">Current Stage</span>
            <div className="mt-1">
              <StatusBadge status={lead.status} />
            </div>
          </div>

          <div className="sidebar-stat-box">
            <span className="sidebar-stat-label">Activity Notes</span>
            <span className="sidebar-stat-number">{noteCount}</span>
          </div>

          <div className="sidebar-stat-box">
            <span className="sidebar-stat-label">Pipeline Age</span>
            <span className="sidebar-stat-number">{diffDays} <span className="stat-unit">days</span></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
