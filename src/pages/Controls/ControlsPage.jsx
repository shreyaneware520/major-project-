import AppLayout from '../../components/Dashboard/AppLayout';
import ControlsContent from '../../components/Controls/ControlsContent';

export default function ControlsPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <ControlsContent />
      </main>
    </AppLayout>
  );
}
