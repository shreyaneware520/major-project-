import AppLayout from '../../components/Dashboard/AppLayout';
import DashboardContent from '../../components/Dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <DashboardContent />
      </main>
    </AppLayout>
  );
}
