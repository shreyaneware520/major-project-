import AppLayout from '../../components/Dashboard/AppLayout';
import ProfileContent from '../../components/Profile/ProfileContent';

export default function ProfilePage() {
  return (
    <AppLayout showSearch={false}>
      <main className="content-wrapper">
        <ProfileContent />
      </main>
    </AppLayout>
  );
}
