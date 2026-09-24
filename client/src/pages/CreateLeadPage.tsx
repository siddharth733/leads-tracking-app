import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, UserPlus, User, Mail, Phone, Tag, Check } from "lucide-react";
import { leadService } from "../services/leadService";
import { ApiError } from "../services/apiClient";
import type { LeadStatus } from "../types/lead";

interface FormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  status: "new",
};

export default function CreateLeadPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setSubmitError("");
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone Number is required";
    } else {
      const phoneDigits = form.phone.replace(/\D/g, "");
      const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

      if (
        !phonePattern.test(form.phone.trim()) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ) {
        nextErrors.phone =
          "Please enter a valid phone number (e.g. +1 (555) 019-2834 or +91 9876543210)";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const controller = new AbortController();

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await leadService.createLead(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          status: form.status,
        },
        { signal: controller.signal },
      );

      navigate(`/leads/${response.data.id}`);
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("aborted"))
      ) {
        return;
      }

      if (err instanceof ApiError && err.errors) {
        const fieldErrors: FormErrors = {};
        if (err.errors.name) fieldErrors.name = err.errors.name[0];
        if (err.errors.email) fieldErrors.email = err.errors.email[0];
        if (err.errors.phone) fieldErrors.phone = err.errors.phone[0];
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      setSubmitError(
        err instanceof Error ? err.message : "Failed to create lead",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      {/* Top Navigation Header */}
      <div className="form-page-header">
        <div>
          <Link to="/leads" className="back-link mb-2">
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Pipeline
          </Link>
          <h1 className="page-title">Add New Lead</h1>
          <p className="page-description">
            Register a new prospective client into your active sales pipeline.
          </p>
        </div>
      </div>

      {/* Main Elevated Form Card */}
      <div className="card create-lead-card">
        <div className="create-lead-card-header">
          <div className="create-lead-icon-badge">
            <UserPlus size={22} strokeWidth={2} />
          </div>
          <div>
            <h2 className="create-lead-title">Lead Information</h2>
            <p className="create-lead-subtitle">
              Provide lead contact details and assign an initial stage.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="create-lead-form">
          <div className="form-grid-2col">
            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <User className="field-input-icon" size={18} strokeWidth={2} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className={errors.name ? "input-error" : ""}
                />
              </div>
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div className="form-field">
              <label htmlFor="email">Email Address *</label>
              <div className="input-with-icon">
                <Mail className="field-input-icon" size={18} strokeWidth={2} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah@company.com"
                  className={errors.email ? "input-error" : ""}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="form-field">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-with-icon">
                <Phone className="field-input-icon" size={18} strokeWidth={2} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 234-5678"
                  className={errors.phone ? "input-error" : ""}
                />
              </div>
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            {/* Initial Lead Status */}
            <div className="form-field">
              <label htmlFor="status">Initial Lifecycle Stage</label>
              <div className="input-with-icon">
                <Tag className="field-input-icon" size={18} strokeWidth={2} />
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="select-with-icon"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="state-error-banner mt-3 mb-3">{submitError}</div>
          )}

          <div className="create-form-actions">
            <Link to="/leads" className="button button-secondary">
              Cancel
            </Link>

            <button
              type="submit"
              className="button button-primary font-medium"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-inline" />
                  Saving Lead...
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  Save Lead Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
