import AppLayout from '../../components/Dashboard/AppLayout';
import AlertsContent from '../../components/Alerts/AlertsContent';

export default function AlertsPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <AlertsContent />
      </main>
    </AppLayout>
  );
}
