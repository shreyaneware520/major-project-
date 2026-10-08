import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AppLayout({
  children,
  syncTime = 2,
  searchValue = '',
  onSearchChange = () => {},
  hasNotification = true,
  onNotificationClick = () => {},
  onAvatarClick = () => {},
  onNavClick,
  showSearch = true,
}) {
  return (
    <>
      <Sidebar syncTime={syncTime} onNavClick={onNavClick} />
      <div className="app-container">
        {showSearch && (
          <TopNavbar
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            hasNotification={hasNotification}
            onNotificationClick={onNotificationClick}
            onAvatarClick={onAvatarClick}
          />
        )}
        {children}
      </div>
    </>
  );
}
