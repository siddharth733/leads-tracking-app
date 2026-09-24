import { Link } from "react-router";
import { Trash2, Mail, Phone } from "lucide-react";
import type { Lead } from "../../types/lead";
import StatusBadge from "../StatusBadge";

interface LeadTableProps {
  leads: Lead[];
  onDelete?: (lead: Lead) => void;
}

export default function LeadTable({ leads, onDelete }: LeadTableProps) {
  return (
    <div className="table-wrapper">
      {/* Desktop Table — hidden on mobile via CSS */}
      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Contact Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Date Added</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="table-row-interactive">
              <td className="font-semibold text-primary">
                <Link to={`/leads/${lead.id}`} className="lead-name-link">
                  {lead.name}
                </Link>
              </td>
              <td className="text-secondary">{lead.email}</td>
              <td className="text-secondary">{lead.phone}</td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
              <td className="text-muted">
                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="text-right">
                <div className="table-actions-cell">
                  <Link to={`/leads/${lead.id}`} className="action-link-btn">
                    View Details
                  </Link>
                  {onDelete && (
                    <button
                      type="button"
                      className="icon-button-danger"
                      onClick={() => onDelete(lead)}
                      title="Delete Lead"
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card List — shown only on small screens via CSS */}
      <div className="lead-cards-list">
        {leads.map((lead) => (
          <div key={lead.id} className="lead-mobile-card">
            <div className="lead-mobile-card-top">
              <Link to={`/leads/${lead.id}`} className="lead-mobile-name">
                {lead.name}
              </Link>
              <StatusBadge status={lead.status} />
            </div>

            <div className="lead-mobile-card-body">
              <div className="lead-mobile-meta-row">
                <Mail size={13} strokeWidth={2} />
                {lead.email}
              </div>
              <div className="lead-mobile-meta-row">
                <Phone size={13} strokeWidth={2} />
                {lead.phone}
              </div>
              <div className="lead-mobile-meta-row">
                Added{" "}
                {new Date(lead.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="lead-mobile-card-actions">
              <Link to={`/leads/${lead.id}`} className="button button-secondary button-sm">
                View Details
              </Link>
              {onDelete && (
                <button
                  type="button"
                  className="button button-danger button-sm"
                  onClick={() => onDelete(lead)}
                >
                  <Trash2 size={14} strokeWidth={2} />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
