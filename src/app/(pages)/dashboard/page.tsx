import ProtectedRoute from "@/components/protected-route/ProtectedRoute"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>This is Dashboard Page</h1>
    </ProtectedRoute>
  )
}