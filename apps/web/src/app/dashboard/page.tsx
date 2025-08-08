import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This is the dashboard page. You are logged in.</p>
      </div>
    </ProtectedRoute>
  );
}
