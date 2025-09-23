// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text)] text-balance">
        Welcome to <span className="text-[var(--primary)]">MonitorPro</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
        Monitor your websites and services in real-time. Get instant alerts when
        downtime occurs and track performance metrics effortlessly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/register" className="btn">
          Get Started
        </Link>
        <Link to="/login" className="btn-secondary">
          Log in
        </Link>
      </div>

      <section className="mt-16 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Keep track of uptime and performance metrics for all your services
              with instant feedback.
            </p>
          </div>

          <div className="card text-center">
            <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
            <p className="text-gray-600 text-sm">
              Receive notifications via email or preferred channels whenever a
              service goes down.
            </p>
          </div>

          <div className="card text-center">
            <h3 className="text-xl font-bold mb-2">Detailed Metrics</h3>
            <p className="text-gray-600 text-sm">
              Analyze response times, latency, and uptime history to optimize
              your services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
