// src/pages/alerts/AlertsListPage.tsx
import { useEffect, useState } from "react";
import { listAlerts, deleteAlerts, type Alert } from "../../services/api";

export default function AlertsListPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listAlerts({ limit: 20 }); // latest 20
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts", err);
      setError("Failed to load alerts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      setDeleting(alertId);
      await deleteAlerts({ alert_id: alertId });
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      console.error("Failed to delete alert", err);
      setError("Failed to delete alert.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Recent Alerts</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No alerts found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-base font-semibold text-gray-800 truncate pr-2">
                  Monitor <span className="font-mono">{alert.monitor_id}</span>
                </h2>
                <button
                  onClick={() => handleDelete(alert.id)}
                  disabled={deleting === alert.id}
                  className={`text-xs px-3 py-1 rounded-lg transition ${
                    deleting === alert.id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {deleting === alert.id ? "Deleting..." : "Delete"}
                </button>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {alert.message}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                  {alert.channel}
                </span>
                <span>{new Date(alert.triggered_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
