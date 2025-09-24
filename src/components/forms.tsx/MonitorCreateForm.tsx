// src/pages/monitors/MonitorCreateForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMonitor } from "../../services/api";

export default function MonitorCreateForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [frequency_sec, setFrequency] = useState(60);
  const [max_latency_ms, setMaxLatency] = useState<number | null>(null);
  const [is_active, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMonitor({
        name,
        url,
        frequency_sec,
        max_latency_ms,
        is_active,
      });
      navigate("/monitors");
    } catch {
      setError("Failed to create monitor");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/monitors")}
        className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
      >
        ← Back to All Monitors
      </button>

      <h1 className="text-2xl font-bold">Create Monitor</h1>
      {error && <div className="text-red-500">{error}</div>}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Frequency (seconds)"
          type="number"
          value={frequency_sec}
          onChange={(e) => setFrequency(Number(e.target.value))}
          required
        />
        <input
          className="input"
          placeholder="Max Latency (ms)"
          type="number"
          value={max_latency_ms ?? ""}
          onChange={(e) =>
            setMaxLatency(e.target.value ? Number(e.target.value) : null)
          }
        />
        <div className="flex items-center gap-2">
          <label>
            <input
              type="checkbox"
              checked={is_active}
              onChange={(e) => setIsActive(e.target.checked)}
            />{" "}
            Active
          </label>
        </div>
        <button type="submit" className="btn w-full">
          Create Monitor
        </button>
      </form>
    </div>
  );
}
