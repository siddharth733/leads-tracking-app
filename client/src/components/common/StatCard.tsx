import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: string;
  variant?: "primary" | "info" | "warning" | "success" | "danger";
}

export default function StatCard({
  label,
  value,
  icon,
  variant = "primary",
}: StatCardProps) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
