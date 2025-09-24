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

        const monitorsData = await listMonitors();
        setMonitors(monitorsData);

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

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-6">{error}</div>
    );

  if (monitors.length === 0)
    return (
      <div className="text-center text-gray-500 py-6">No monitors found.</div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Your Monitors Metrics
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {monitors.map((monitor) => (
          <div
            key={monitor.id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-4 gap-2">
              {/* Monitor name with truncation */}
              <h2 className="text-lg font-semibold text-gray-900 flex-1 truncate">
                {monitor.name}
              </h2>
              <Link
                to={`/monitors/${monitor.id}/metrics`}
                className="flex-shrink-0 text-sm px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                View All
              </Link>
            </div>

            {/* Metrics list */}
            <div className="flex flex-col space-y-3">
              {metricsMap[monitor.id]?.length === 0 && (
                <div className="text-gray-500 text-sm">No metrics yet.</div>
              )}

              {metricsMap[monitor.id]?.map((metric) => (
                <div
                  key={metric.id}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg border transition ${
                    metric.is_up
                      ? "bg-green-50 border-green-200 hover:bg-green-100"
                      : "bg-red-50 border-red-200 hover:bg-red-100"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
                        metric.is_up
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {metric.is_up ? "UP" : "DOWN"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(metric.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {metric.response_ms} ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
