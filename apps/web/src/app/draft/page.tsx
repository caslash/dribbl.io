'use client';

import { RoomEntrance } from '@/components/draft/RoomEntrance';
import { useDraft } from '@/hooks/useDraft';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The `/draft` entry page.
 *
 * Shows `RoomEntrance` for name entry and room creation / joining.
 * If the user already has a roomId in context (e.g. after creating a room),
 * redirects immediately to `/draft/:roomId`.
 */
export default function DraftLobbyPage() {
  const { state } = useDraft();
  const router = useRouter();

  useEffect(() => {
    if (state.roomId && state.phase !== 'entrance') {
      router.push(`/draft/${state.roomId}`);
    }
  }, [state.roomId, state.phase, router]);

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <RoomEntrance />
    </div>
  );
}
