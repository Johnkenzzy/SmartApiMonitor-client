// src/pages/monitors/MonitorViewPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMonitor, type Monitor } from "../../services/api";

export default function MonitorViewPage() {
  const { id } = useParams<{ id: string }>();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMonitor = async () => {
      try {
        const data = await getMonitor(id);
        setMonitor(data);
      } catch {
        setError("Failed to fetch monitor");
      } finally {
        setLoading(false);
      }
    };
    fetchMonitor();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-6">{error}</div>
    );

  if (!monitor)
    return (
      <div className="text-center text-gray-500 py-6">Monitor not found.</div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{monitor.name}</h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(monitor.updated_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/monitors"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
          >
            All Monitors
          </Link>
          <Link
            to={`/monitors/${monitor.id}/metrics`}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition"
          >
            View Metrics
          </Link>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white shadow rounded-xl p-6 grid gap-4 sm:grid-cols-2">
        <Detail label="URL" value={monitor.url} />
        <Detail label="Frequency" value={`${monitor.frequency_sec}s`} />
        <Detail
          label="Status"
          value={
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                monitor.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {monitor.is_active ? "Active" : "Inactive"}
            </span>
          }
        />
        {monitor.max_latency_ms != null && (
          <Detail label="Max Latency" value={`${monitor.max_latency_ms} ms`} />
        )}
        <Detail
          label="Created At"
          value={new Date(monitor.created_at).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(monitor.updated_at).toLocaleString()}
        />

        {/* Edit button inside card */}
        <div className="sm:col-span-2 flex justify-end mt-4">
          <Link
            to={`/monitors/${monitor.id}/edit`}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition"
          >
            Edit Monitor
          </Link>
        </div>
      </div>
    </div>
  );
}

// Small reusable component for displaying details
function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-500">{label}</div>
      <div className="mt-1 text-gray-900 break-all">{value}</div>
    </div>
  );
}
