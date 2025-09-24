// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMe,
  listMonitors,
  listMetrics,
  listAlerts,
  type User,
  type Monitor,
  type Metric,
  type Alert,
} from "../services/api";

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch everything in parallel
        const [userData, monitorsData, metricsData, alertsData] =
          await Promise.all([
            getMe(),
            listMonitors(),
            listMetrics({ limit: 101 }), // request 101 to detect >100
            listAlerts({ limit: 101 }),
          ]);

        setUser(userData);
        setMonitors(monitorsData);
        setMetrics(metricsData);
        setAlerts(alertsData);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatCount = (arr: { length: number }) =>
    arr.length > 100 ? "100+" : arr.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-[var(--text)]">
          Welcome{user ? `, ${user.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="text-gray-500">
          Here’s what’s happening with your monitors today.
        </p>
      </div>

      {loading && (
        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {user && !loading && (
        <>
          {/* Profile Card */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Email</span>
                <p>{user.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Joined</span>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status</span>
                <p>
                  {user.is_active ? (
                    <span className="badge badge-success">Active</span>
                  ) : (
                    <span className="badge badge-error">Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover:shadow-lg transition p-6">
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                Monitors
              </h3>
              <p className="text-3xl font-bold mt-2">{monitors.length}</p>
              <p className="text-gray-500">Total Monitors</p>
            </div>

            <div className="card hover:shadow-lg transition p-6">
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                Metrics
              </h3>
              <p className="text-3xl font-bold mt-2">{formatCount(metrics)}</p>
              <p className="text-gray-500">Recent Performance Data</p>
            </div>

            <div className="card hover:shadow-lg transition p-6">
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                Alerts
              </h3>
              <p className="text-3xl font-bold mt-2">{formatCount(alerts)}</p>
              <p className="text-gray-500">Recent Notifications</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/monitors" className="btn text-center">
                View Monitors
              </Link>
              <Link to="/monitors/create" className="btn text-center">
                Create Monitor
              </Link>
              <Link to="/metrics" className="btn text-center">
                View Metrics
              </Link>
              <Link to="/alerts" className="btn text-center">
                View Alerts
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
