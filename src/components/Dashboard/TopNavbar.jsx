import { Search, Bell, CircleUser } from 'lucide-react';

export default function TopNavbar({
  searchValue,
  onSearchChange,
  hasNotification,
  onNotificationClick,
  onAvatarClick,
}) {
  return (
    <header className="top-navbar">
      <div className="search-bar-container">
        <Search
          size={16}
          strokeWidth={2}
          className="search-icon-svg"
        />
        <input
          type="text"
          className="search-input"
          id="reports-search"
          placeholder="Search analytics, logs, or reports..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="navbar-actions">
        <button
          className={`nav-action-btn${hasNotification ? ' has-notification' : ''}`}
          aria-label="Notifications"
          id="notification-btn"
          onClick={onNotificationClick}
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>
        <button
          className="nav-action-btn profile-avatar-btn"
          aria-label="User profile"
          id="profile-avatar-btn"
          onClick={onAvatarClick}
        >
          <CircleUser size={28} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
