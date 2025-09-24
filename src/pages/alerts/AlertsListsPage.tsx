// src/pages/alerts/AlertsListPage.tsx
import { useEffect, useState } from "react";
import { listAlerts, deleteAlerts, type Alert } from "../../services/api";

export default function AlertsListPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await listAlerts({ limit: 20 }); // latest 20
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts", err);
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
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recent Alerts</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts found.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Monitor <span className="font-mono">{alert.monitor_id}</span>
                </h2>
                <button
                  onClick={() => handleDelete(alert.id)}
                  disabled={deleting === alert.id}
                  className="btn btn-error btn-sm"
                >
                  {deleting === alert.id ? "Deleting..." : "Delete"}
                </button>
              </div>
              <p>{alert.message}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Channel: {alert.channel}</span>
                <span>{new Date(alert.triggered_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
