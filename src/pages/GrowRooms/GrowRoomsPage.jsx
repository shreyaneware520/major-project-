import AppLayout from '../../components/Dashboard/AppLayout';
import GrowRoomsContent from '../../components/GrowRooms/GrowRoomsContent';

export default function GrowRoomsPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <GrowRoomsContent />
      </main>
    </AppLayout>
  );
}
