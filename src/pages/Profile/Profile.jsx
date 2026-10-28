
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProfileEditForm, ProfileInfo } from '../../components/Profile';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          {/* Bottom Section Grid: Edit Form & Change Password Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileEditForm />
            </div>
            <div className="lg:col-span-1">
              <ProfileInfo />
            </div>
          </div>
    </main>
  );
};

export default Profile;
