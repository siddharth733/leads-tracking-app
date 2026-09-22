import { Link, useSearchParams } from "react-router";
import type { Lead, LeadStatus } from "../types/lead";
import { useEffect, useState } from "react";
import { getLeads } from "../services/api";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

const LeadsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") as LeadStatus | null) ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getLeads({
          search: search || undefined,
          status: status || undefined,
          page,
          limit: PAGE_SIZE,
        });

        setLeads(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load leads",
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [search, status, page]);

  const updateParams = (updates: Record<string, string | undefined>) => {
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

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateParams({
      search: searchInput.trim() || undefined,
      page: "1",
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      status: event.target.value || undefined,
      page: "1",
    });
  };

  const handlePageChange = (nextPage: number) => {
    updateParams({
      page: String(nextPage),
    });
  };
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p>Manage and track your leads.</p>
        </div>

        <Link to="/leads/new" className="button button-primary">
          + Create Lead
        </Link>
      </div>
      <form className="filters" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <select value={status} onChange={handleStatusChange}>
          <option value="">All statuses</option>
          {statuses?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>

        {loading && <div className="state">Loading leads...</div>}
        {!loading && !error && leads.length === 0 && (
          <div className="state">No leads found</div>
        )}
        {!loading && !error && leads.length > 0 && (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads?.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead?.name}</td>
                      <td>{lead?.email}</td>
                      <td>{lead?.phone}</td>
                      <td>{lead?.status}</td>
                      <td>{new Date(lead?.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/leads/${lead?.id}`}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </form>
    </section>
  );
};

export default LeadsPage;
