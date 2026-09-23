import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Lead, LeadStatus, Note } from "../types/lead";
import {
  createNote,
  deleteLead,
  getLeadById,
  getNotes,
  updateLead,
} from "../services/api";
import StatusBadge from "../components/StatusBadge";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "lost"];
export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid lead ID");
      setLoading(false);
      return;
    }

    const leadId = Number(id);
    if (Number.isNaN(leadId)) {
      setError("Invalid lead ID");
      setLoading(false);
      return;
    }

    const loadLead = async () => {
      try {
        setLoading(true);
        setError("");

        const [leadResponse, notesResponse] = await Promise.all([
          getLeadById(leadId),
          getNotes(leadId),
        ]);

        setLead(leadResponse.data);
        setNotes(notesResponse.data);
      } catch (error) {
        setError(
          error instanceof Error ? error?.message : "Failed to load lead",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id]);

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!lead) {
      return;
    }

    const newStatus = event.target.value as LeadStatus;
    try {
      setStatusLoading(true);
      setError("");
      const response = await updateLead(lead.id, {
        status: newStatus,
      });

      setLead(response.data);
    } catch (error) {
      setError(
        error instanceof Error ? error?.message : "Failed to update status",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lead || !noteContent.trim()) {
      return;
    }

    try {
      setNoteLoading(true);
      setNoteError("");

      const response = await createNote(lead.id, {
        content: noteContent.trim(),
      });

      setNotes((current) => [response.data, ...current]);

      setNoteContent("");
    } catch (error) {
      setNoteError(
        error instanceof Error ? error?.message : "Failed to add note",
      );
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!lead) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${lead.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteLead(lead.id);
      navigate("/leads");
    } catch (error) {
      setNoteError(
        error instanceof Error ? error?.message : "Failed to delete lead",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="state">Loading lead...</div>;
  }

  if (error && !lead) {
    return (
      <div>
        <div className="state state-error">{error}</div>
        <div className="detail-actions">
          <Link to="/leads">Back to Leads</Link>
        </div>
      </div>
    );
  }

  if (!lead) {
    return <div className="state">Lead not found.</div>;
  }

  return (
    <section className="detail-page">
      <div className="detail-header">
        <div>
          <Link to="/leads" className="back-link">
            Back to Leads
          </Link>
          <h1>{lead?.name}</h1>
          <div className="lead-meta">
            <span>{lead.email}</span>
            <span>{lead.phone}</span>
          </div>
        </div>
        <button
          className="button button-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Lead"}
        </button>
      </div>

      {error && <div className="state-error form-error">{error}</div>}

      <div className="detail-card">
        <div className="detail-row">
          <strong>Status</strong>

          <div className="status-control">
            <StatusBadge status={lead.status} />

            <select
              value={lead.status}
              onChange={handleStatusChange}
              disabled={statusLoading}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="detail-row">
          <strong>Created</strong>

          <span>{new Date(lead.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="notes-section">
        <div className="section-header">
          <h2>Notes</h2>
          <span>{notes.length}</span>
        </div>

        <form className="note-form" onSubmit={handleAddNote}>
          <textarea
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            placeholder="Write a note..."
            rows={4}
          />

          {noteError && <p className="field-error">{noteError}</p>}

          <button
            type="submit"
            className="button button-primary"
            disabled={noteLoading || !noteContent.trim()}
          >
            {noteLoading ? "Adding..." : "Add Note"}
          </button>
        </form>

        {notes.length === 0 ? (
          <div className="state">No notes yet.</div>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <article key={note.id} className="note-card">
                <p>{note.content}</p>

                <time>{new Date(note.createdAt).toLocaleString()}</time>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
