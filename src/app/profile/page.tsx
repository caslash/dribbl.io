'use client';

import JoinHostModal from '@/components/config/multiplayer/joinhostmodal';

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <p>User Profile</p>
      <JoinHostModal />
    </div>
  );
}
