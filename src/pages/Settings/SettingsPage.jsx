import AppLayout from '../../components/Dashboard/AppLayout';
import SettingsContent from '../../components/Settings/SettingsContent';

export default function SettingsPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <SettingsContent />
      </main>
    </AppLayout>
  );
}
