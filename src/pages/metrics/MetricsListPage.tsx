// src/pages/monitors/MetricsListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listMonitors,
  listMetrics,
  type Monitor,
  type Metric,
} from "../../services/api";

export default function MetricsListPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [metricsMap, setMetricsMap] = useState<Record<string, Metric[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get all monitors
        const monitorsData = await listMonitors();
        setMonitors(monitorsData);

        // Fetch metrics for each monitor (latest 10)
        const metricsPromises = monitorsData.map((monitor) =>
          listMetrics({ monitor_id: monitor.id, limit: 10 })
        );

        const metricsResults = await Promise.all(metricsPromises);

        const map: Record<string, Metric[]> = {};
        monitorsData.forEach((monitor, idx) => {
          map[monitor.id] = metricsResults[idx];
        });

        setMetricsMap(map);
      } catch {
        setError("Failed to fetch metrics list.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  if (monitors.length === 0)
    return <div className="text-gray-500">No monitors found.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Monitors Metrics</h1>

      {monitors.map((monitor) => (
        <div key={monitor.id} className="card space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{monitor.name}</h2>
            <Link
              to={`/monitors/${monitor.id}/metrics`}
              className="btn-secondary text-sm"
            >
              View All Metrics
            </Link>
          </div>

          {/* Metrics chat list */}
          <div className="flex flex-col space-y-2">
            {metricsMap[monitor.id]?.length === 0 && (
              <div className="text-gray-500">No metrics yet.</div>
            )}

            {metricsMap[monitor.id]?.map((metric) => (
              <div
                key={metric.id}
                className={`flex justify-between items-center px-3 py-2 rounded-lg shadow-sm border ${
                  metric.is_up
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {metric.is_up ? "UP" : "DOWN"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(metric.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {metric.response_ms} ms
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
