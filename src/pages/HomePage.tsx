// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, type User } from "../services/api";

function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--text)] leading-tight">
        Supercharge Your Monitoring with{" "}
        <span className="text-[var(--primary)]">MonitorPro</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl animate-fadeIn">
        Stay ahead of downtime and performance issues. Get real-time insights,
        instant alerts, and actionable metrics — all in one place.
      </p>

      {/* CTA Buttons */}
      {!loading && !user && (
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
          <Link
            to="/register"
            className="btn text-lg px-6 py-3 shadow-md hover:scale-105 transition"
          >
            🚀 Get Started
          </Link>
          <Link
            to="/login"
            className="btn-secondary text-lg px-6 py-3 shadow-md hover:scale-105 transition"
          >
            🔑 Log in
          </Link>
        </div>
      )}

      {user && (
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
          <Link
            to="/dashboard"
            className="btn text-lg px-6 py-3 shadow-md hover:scale-105 transition"
          >
            📊 Go to Dashboard
          </Link>
          <Link
            to="/monitors/create"
            className="btn-secondary text-lg px-6 py-3 shadow-md hover:scale-105 transition"
          >
            ➕ Create Monitor
          </Link>
        </div>
      )}

      {/* Features Section */}
      <section className="mt-20 w-full max-w-6xl">
        <h2 className="text-3xl font-semibold mb-10 text-[var(--text)]">
          Why Choose MonitorPro?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-3">⚡ Real-time Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Track uptime and performance metrics with instant updates for all
              your critical services.
            </p>
          </div>

          <div className="card text-center p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-3">🔔 Instant Alerts</h3>
            <p className="text-gray-600 text-sm">
              Get notified immediately via email or preferred channels whenever
              a service goes down.
            </p>
          </div>

          <div className="card text-center p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-3">📈 Detailed Metrics</h3>
            <p className="text-gray-600 text-sm">
              Gain insights into response times, latency, and uptime history to
              optimize your services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
