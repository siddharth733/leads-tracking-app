import { Search } from "lucide-react";
import type { LeadStatus } from "../../types/lead";

interface LeadFiltersProps {
  searchInput: string;
  selectedStatus: string;
  statuses: LeadStatus[];
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

export default function LeadFilters({
  searchInput,
  selectedStatus,
  statuses,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: LeadFiltersProps) {
  const hasActiveFilters = searchInput.trim() !== "" || selectedStatus !== "";

  return (
    <div className="filters-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} strokeWidth={2} />
        <input
          type="search"
          placeholder="Search leads by name, email..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-select-wrapper">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="button button-ghost"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
