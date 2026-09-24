import type { Note } from "../../types/lead";
import EmptyState from "../common/EmptyState";
import NoteItem from "./NoteItem";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No activity notes logged yet"
        description="Record client interaction summaries, call logs, or meeting notes using the form above."
      />
    );
  }

  return (
    <div className="timeline-notes-wrapper">
      <div className="timeline-connector-line" />
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}
