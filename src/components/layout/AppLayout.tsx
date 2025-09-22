// src/components/layout/AppLayout.tsx
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const isAuthenticated = Boolean(token);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg shadow-sm"
                style={{
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 6px 18px rgba(163,230,53,0.14)",
                }}
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 2a1 1 0 0 1 .894.553l2.5 5a1 1 0 0 1-.176 1.038L13 11l1 6-4-2-4 2 1-6-1.218-2.409A1 1 0 0 1 5.106 7L7.5 2.553A1 1 0 0 1 8.382 2h3.236z" />
                </svg>
              </span>

              <div className="leading-tight">
                <div className="text-lg font-bold">
                  Smart<span className="text-[var(--primary)]">API</span>
                </div>
                <div className="text-xs text-gray-500 -mt-0.5">Monitor</div>
              </div>
            </Link>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn-secondary">
                    Dashboard
                  </Link>
                  <button className="btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((s) => !s)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white border border-gray-100 shadow-sm"
              >
                {menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/80 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center btn-secondary"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-center btn"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center btn-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center btn"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} SmartAPI Monitor — Built with care
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
