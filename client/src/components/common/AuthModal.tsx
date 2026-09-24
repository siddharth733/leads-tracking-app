import { useState } from "react";
import { Lock, User, Key, Eye, EyeOff, ShieldAlert, X, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and Password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const success = await login(username.trim(), password.trim());
      if (!success) {
        setError("Invalid username or password. Please try again.");
      }
    } catch {
      setError("Authentication failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <button
          type="button"
          onClick={closeAuthModal}
          className="auth-modal-close-btn"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-icon-badge">
            <Lock size={24} strokeWidth={2.2} />
          </div>
          <h2 className="auth-modal-title">Authentication Required</h2>
          <p className="auth-modal-subtitle">
            This API endpoint is protected by Basic Authentication. Enter your admin credentials to proceed.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          <div className="form-field">
            <label htmlFor="auth-username">Username</label>
            <div className="input-with-icon">
              <User className="field-input-icon" size={18} strokeWidth={2} />
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="auth-password">Password</label>
            <div className="input-with-icon">
              <Key className="field-input-icon" size={18} strokeWidth={2} />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-modal-actions">
            <button
              type="button"
              onClick={closeAuthModal}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="button button-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {loading ? (
                <>
                  <span className="spinner-inline" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
