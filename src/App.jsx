import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { PageSkeleton } from "./components/common/Skeletons";

// Lazy-loaded route components for maximum code splitting & fast initial paint
const Landing = lazy(() => import("./pages/Landing/Landing"));
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const GrowRooms = lazy(() => import("./pages/GrowRooms/GrowRooms"));
const RoomDetails = lazy(() => import("./pages/RoomDetails/RoomDetails"));
const Controls = lazy(() => import("./pages/Controls/Controls"));
const Alerts = lazy(() => import("./pages/Alerts/Alerts"));
const ReportHistory = lazy(() => import("./pages/ReportHistory/ReportHistory"));
const Settings = lazy(() => import("./pages/Settings/Settings"));

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />

              {/* Protected Routes with Persistent AppLayout Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/user-management"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<Navigate to="/user-management" replace />} />
                <Route path="/grow-rooms" element={<GrowRooms />} />
                <Route path="/room/:id" element={<RoomDetails />} />
                <Route path="/grow-rooms/:id" element={<RoomDetails />} />
                <Route path="/controls" element={<Controls />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<ReportHistory />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;