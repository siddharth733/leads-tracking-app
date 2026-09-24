interface LoadingSpinnerProps {
  label?: string;
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({
  label = "Loading...",
  size = "medium",
}: LoadingSpinnerProps) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-ring" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
