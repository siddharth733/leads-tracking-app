import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { leadService } from "../services/leadService";
import { noteService } from "../services/noteService";
import type { Lead, LeadStatus, Note } from "../types/lead";

import LeadHeader from "../components/lead-detail/LeadHeader";
import LeadStatusCard from "../components/lead-detail/LeadStatusCard";
import LeadSidebar from "../components/lead-detail/LeadSidebar";
import NoteList from "../components/notes/NoteList";
import AddNoteForm from "../components/notes/AddNoteForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import DeleteModal from "../components/common/DeleteModal";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    const leadId = Number(id);
    if (!id || Number.isNaN(leadId)) {
      setError("Invalid lead ID");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [leadRes, notesRes] = await Promise.all([
          leadService.getLeadById(leadId, { signal: controller.signal }),
          noteService.getNotesByLeadId(leadId, { signal: controller.signal }),
        ]);

        if (!controller.signal.aborted) {
          setLead(leadRes.data);
          setNotes(notesRes.data);
        }
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || err.message.includes("aborted"))
        ) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load lead details",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeadDetails();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead || lead.status === newStatus) return;

    const controller = new AbortController();

    try {
      setStatusLoading(true);
      setError("");

      const response = await leadService.updateLead(
        lead.id,
        { status: newStatus },
        { signal: controller.signal },
      );

      setLead(response.data);
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("aborted"))
      ) {
        return;
      }
      setError(
        err instanceof Error ? err.message : "Failed to update lead status",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lead || !noteContent.trim()) return;

    const controller = new AbortController();

    try {
      setNoteLoading(true);
      setNoteError("");

      const response = await noteService.createNote(
        lead.id,
        { content: noteContent.trim() },
        { signal: controller.signal },
      );

      setNotes((prevNotes) => [response.data, ...prevNotes]);
      setNoteContent("");
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("aborted"))
      ) {
        return;
      }
      setNoteError(
        err instanceof Error ? err.message : "Failed to post note",
      );
    } finally {
      setNoteLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!lead) return;

    const controller = new AbortController();

    try {
      setDeleting(true);
      setError("");

      await leadService.deleteLead(lead.id, { signal: controller.signal });
      navigate("/leads");
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("aborted"))
      ) {
        return;
      }
      setError(
        err instanceof Error ? err.message : "Failed to delete lead",
      );
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading lead details..." size="large" />;
  }

  if (error && !lead) {
    return (
      <div className="detail-error-container">
        <div className="state-error-banner">{error}</div>
        <div className="mt-4">
          <Link to="/leads" className="button button-secondary">
            &larr; Back to Leads Pipeline
          </Link>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="detail-error-container">
        <div className="state-error-banner">Lead not found.</div>
        <div className="mt-4">
          <Link to="/leads" className="button button-secondary">
            &larr; Back to Leads Pipeline
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-detail-container">
      {/* Top Hero Banner Header */}
      <LeadHeader
        lead={lead}
        deleting={deleting}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {error && <div className="state-error-banner mb-4">{error}</div>}

      {/* 2-Column Responsive Layout Grid */}
      <div className="lead-detail-grid">
        {/* Primary Main Section */}
        <main className="lead-detail-main">
          {/* Interactive Pipeline Stepper Card */}
          <LeadStatusCard
            currentStatus={lead.status}
            statuses={STATUSES}
            statusLoading={statusLoading}
            onStatusChange={handleStatusChange}
          />

          {/* Activity & Notes Timeline Section */}
          <section className="notes-section">
            <div className="section-header-title">
              <h2>Activity & Timeline Notes</h2>
              <span className="badge badge-count">{notes.length}</span>
            </div>

            <AddNoteForm
              noteContent={noteContent}
              noteLoading={noteLoading}
              noteError={noteError}
              onContentChange={setNoteContent}
              onSubmit={handleAddNote}
            />

            <NoteList notes={notes} />
          </section>
        </main>

        {/* Sidebar Section */}
        <LeadSidebar lead={lead} noteCount={notes.length} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        leadName={lead.name}
        deleting={deleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
