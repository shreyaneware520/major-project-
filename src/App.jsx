import { Routes, Route, Navigate } from 'react-router-dom';
import ReportHistoryPage from './pages/ReportHistory/ReportHistoryPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import GrowRoomsPage from './pages/GrowRooms/GrowRoomsPage';
import ControlsPage from './pages/Controls/ControlsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RoomDetailsPage from './pages/RoomDetails/RoomDetailsPage';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/report-history" replace />} />
      <Route path="/report-history" element={<ReportHistoryPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/grow-rooms" element={<GrowRoomsPage />} />
      <Route path="/controls" element={<ControlsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/room-details" element={<RoomDetailsPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
}
