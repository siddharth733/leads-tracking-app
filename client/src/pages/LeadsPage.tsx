import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { LayoutGrid, Table2 } from "lucide-react";
import { leadService } from "../services/leadService";
import { useDebounce } from "../hooks/useDebounce";
import type { Lead, LeadStatus } from "../types/lead";

import LeadFilters from "../components/leads/LeadFilters";
import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import DeleteModal from "../components/common/DeleteModal";

const PAGE_SIZE = 10;
const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") as LeadStatus | null) ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTargetLead, setDeleteTargetLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");

  const [viewMode, setViewMode] = useState<"card" | "table">(() => {
    return (localStorage.getItem("leads_view_mode") as "card" | "table") ?? "table";
  });

  const handleViewMode = (mode: "card" | "table") => {
    setViewMode(mode);
    localStorage.setItem("leads_view_mode", mode);
  };

  // Keep searchInput state in sync with URL search param changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Update URL search param when debounced search value changes
  useEffect(() => {
    if (debouncedSearch.trim() !== search.trim()) {
      updateQueryParams({
        search: debouncedSearch.trim() || undefined,
        page: "1",
      });
    }
  }, [debouncedSearch]);

  // Fetch leads with AbortController for request cancellation
  useEffect(() => {
    const controller = new AbortController();

    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await leadService.getLeads(
          {
            search: search || undefined,
            status: status || undefined,
            page,
            limit: PAGE_SIZE,
          },
          { signal: controller.signal },
        );

        if (!controller.signal.aborted) {
          setLeads(response.data);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || err.message.includes("aborted"))
        ) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to fetch leads",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeads();

    return () => {
      controller.abort();
    };
  }, [search, status, page]);

  const updateQueryParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const handleStatusFilter = (newStatus: string) => {
    updateQueryParams({
      status: newStatus || undefined,
      page: "1",
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handlePageChange = (nextPage: number) => {
    updateQueryParams({ page: String(nextPage) });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetLead) return;

    const controller = new AbortController();

    try {
      setDeleting(true);

      await leadService.deleteLead(deleteTargetLead.id, {
        signal: controller.signal,
      });

      // Update local state immediately
      setLeads((prev) => prev.filter((l) => l.id !== deleteTargetLead.id));
      setDeleteTargetLead(null);
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
      setDeleteTargetLead(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="leads-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads Pipeline</h1>
          <p className="page-description">
            Track, manage, and convert incoming customer leads.
          </p>
        </div>
      </div>

      {/* Filters + View Toggle */}
      <div className="filters-and-toggle">
        <LeadFilters
          searchInput={searchInput}
          selectedStatus={status}
          statuses={STATUSES}
          onSearchChange={setSearchInput}
          onStatusChange={handleStatusFilter}
          onClearFilters={handleClearFilters}
        />
        <div className="view-toggle-group">
          <button
            type="button"
            className={`view-toggle-btn${viewMode === "table" ? " active" : ""}`}
            onClick={() => handleViewMode("table")}
            title="Table View"
          >
            <Table2 size={17} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`view-toggle-btn${viewMode === "card" ? " active" : ""}`}
            onClick={() => handleViewMode("card")}
            title="Card View"
          >
            <LayoutGrid size={17} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading && <LoadingSpinner label="Loading pipeline leads..." size="large" />}

      {!loading && error && (
        <div className="state-error-banner">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <EmptyState
          title="No leads match your criteria"
          description={
            search || status
              ? "Try adjusting your search keywords or status filter."
              : "Get started by adding your first lead to the pipeline."
          }
          action={
            search || status ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={handleClearFilters}
              >
                Clear Search & Filters
              </button>
            ) : null
          }
        />
      )}

      {!loading && !error && leads.length > 0 && (
        <>
          {viewMode === "card" ? (
            <div className="leads-card-grid">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onDelete={setDeleteTargetLead}
                />
              ))}
            </div>
          ) : (
            <LeadTable leads={leads} onDelete={setDeleteTargetLead} />
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Delete Lead Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTargetLead)}
        leadName={deleteTargetLead?.name}
        deleting={deleting}
        onClose={() => setDeleteTargetLead(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
