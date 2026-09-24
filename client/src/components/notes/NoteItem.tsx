import { MessageSquare } from "lucide-react";
import type { Note } from "../../types/lead";

interface NoteItemProps {
  note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
  const createdDate = new Date(note.createdAt);

  return (
    <article className="timeline-note-item">
      <div className="timeline-node">
        <MessageSquare size={13} strokeWidth={2.5} />
      </div>

      <div className="timeline-note-card">
        <div className="timeline-note-header">
          <span className="note-author-badge">Logged Note</span>
          <time className="note-timestamp" dateTime={note.createdAt}>
            {createdDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {createdDate.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        <p className="note-content">{note.content}</p>
      </div>
    </article>
  );
}
