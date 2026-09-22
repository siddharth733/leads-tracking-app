import { Link, useNavigate } from "react-router";
import type { LeadStatus } from "../types/lead";
import { useState } from "react";
import { createLead } from "../services/api";

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

const initalForm: FormData = {
  name: "",
  email: "",
  phone: "",
  status: "new",
};

const CreateLeadPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(initalForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitError("");
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone is required";
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

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
      });

      navigate(`/leads/${response.data.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create lead",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className="form-page">
      <div className="form-header">
        <div>
          <h1>Create Lead</h1>
          <p>Add new lead to your pipeline</p>
        </div>
        <Link to="/leads">Back to leads</Link>
      </div>
      <form className="lead-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />

          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {submitError && (
          <div className="state-error form-error">{submitError}</div>
        )}

        <div className="form-actions">
          <Link to="/leads" className="button button-secondary">
            Cancel
          </Link>

          <button
            type="submit"
            className="button button-primary"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateLeadPage;
