import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  leadName?: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  title = "Delete Lead Profile",
  leadName,
  deleting,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !deleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, deleting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          disabled={deleting}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-badge danger">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="modal-title">{title}</h3>
            <p className="modal-subtitle">This action cannot be undone.</p>
          </div>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to permanently delete lead{" "}
            <strong>{leadName ? `"${leadName}"` : "profile"}</strong>? All associated
            activity timeline notes and pipeline history will be removed.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="spinner-inline" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} strokeWidth={2} />
                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
