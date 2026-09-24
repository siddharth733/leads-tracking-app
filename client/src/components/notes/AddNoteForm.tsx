import { FileText, Plus } from "lucide-react";

interface AddNoteFormProps {
  noteContent: string;
  noteLoading: boolean;
  noteError: string;
  onContentChange: (content: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddNoteForm({
  noteContent,
  noteLoading,
  noteError,
  onContentChange,
  onSubmit,
}: AddNoteFormProps) {
  return (
    <form className="card note-form-card" onSubmit={onSubmit}>
      <div className="note-form-header">
        <h3 className="form-card-title">
          <FileText size={18} strokeWidth={2} />
          Record Activity Note
        </h3>
        <span className="text-muted-sm">Log calls, meetings, or emails</span>
      </div>

      <div className="form-field mb-3">
        <textarea
          value={noteContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Type call summary, client feedback, or next action steps..."
          rows={3}
          className="note-textarea"
        />
        {noteError && <p className="field-error mt-2">{noteError}</p>}
      </div>

      <div className="note-form-footer">
        <span className="hint-text">
          {noteContent.trim().length} characters typed
        </span>

        <button
          type="submit"
          className="button button-primary"
          disabled={noteLoading || !noteContent.trim()}
        >
          {noteLoading ? (
            <>
              <span className="spinner-inline" />
              Posting Note...
            </>
          ) : (
            <>
              <Plus size={15} strokeWidth={2.5} />
              Post Note
            </>
          )}
        </button>
      </div>
    </form>
  );
}
