import AppLayout from '../../components/Dashboard/AppLayout';
import RoomDetailsContent from '../../components/RoomDetails/RoomDetailsContent';

export default function RoomDetailsPage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <RoomDetailsContent />
      </main>
    </AppLayout>
  );
}
