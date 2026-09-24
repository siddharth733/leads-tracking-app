import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAuthCredentials,
  setAuthCredentials,
  clearAuthCredentials,
  verifyCredentials,
  isEnvAuth as checkIsEnvAuth,
  isLocalStorageAuth as checkIsLocalStorageAuth,
} from "../services/apiClient";

interface AuthContextType {
  isAuthModalOpen: boolean;
  isAuthenticated: boolean;
  isEnvAuth: boolean;
  isLocalStorageAuth: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(getAuthCredentials()),
  );
  const [isEnvAuth, setIsEnvAuth] = useState<boolean>(checkIsEnvAuth());
  const [isLocalStorageAuth, setIsLocalStorageAuth] = useState<boolean>(
    checkIsLocalStorageAuth(),
  );

  useEffect(() => {
    const handleAuthRequired = () => {
      if (!checkIsEnvAuth()) {
        setIsAuthModalOpen(true);
      }
    };

    const handleAuthChanged = () => {
      setIsAuthenticated(Boolean(getAuthCredentials()));
      setIsEnvAuth(checkIsEnvAuth());
      setIsLocalStorageAuth(checkIsLocalStorageAuth());
    };

    window.addEventListener("auth:required", handleAuthRequired);
    window.addEventListener("auth:changed", handleAuthChanged);

    return () => {
      window.removeEventListener("auth:required", handleAuthRequired);
      window.removeEventListener("auth:changed", handleAuthChanged);
    };
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    const isValid = await verifyCredentials(username, password);
    if (isValid) {
      setAuthCredentials(username, password);
      setIsAuthenticated(true);
      setIsLocalStorageAuth(true);
      setIsAuthModalOpen(false);
      window.location.reload();
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAuthCredentials();
    setIsAuthenticated(false);
    setIsLocalStorageAuth(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        isAuthenticated,
        isEnvAuth,
        isLocalStorageAuth,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
