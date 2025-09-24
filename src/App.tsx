// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MonitorsListPage from "./pages/monitors/MonitorsListPage";
import MonitorViewPage from "./pages/monitors/MonitorViewPage";
import MonitorCreateForm from "./components/forms.tsx/MonitorCreateForm";
import MonitorUpdateForm from "./components/forms.tsx/MonitorUpdateForm";
import MetricsPage from "./pages/metrics/MonitorMetricsPage";
import MetricsListPage from "./pages/metrics/MetricsListPage";
import AlertsListPage from "./pages/alerts/AlertsListsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes wrapped with AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Private routes wrapped with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/monitors" element={<MonitorsListPage />} />
          <Route path="/monitors/:id" element={<MonitorViewPage />} />
          <Route path="/monitors/create" element={<MonitorCreateForm />} />
          <Route path="/monitors/:id/edit" element={<MonitorUpdateForm />} />
          <Route path="/monitors/:id/metrics" element={<MetricsPage />} />
          <Route path="/metrics" element={<MetricsListPage />} />
          <Route path="/alerts" element={<AlertsListPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
