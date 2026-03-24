import { Button, Card, Input } from '@/components';
import { useDraft } from '@/hooks/useDraft';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

/**
 * The entry screen for the NBA All-Time Draft.
 *
 * Presents two flows side by side: creating a new room and joining an existing one.
 * On success, navigates to `/draft/:roomId`.
 *
 * @example
 * <RoomEntrance />
 */
export function RoomEntrance() {
  const { createRoom, joinRoom } = useDraft();
  const navigate = useNavigate();

  const [createName, setCreateName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = createName.trim();
    if (!trimmed) {
      toast.error('Please enter your name.');
      return;
    }
    setCreateLoading(true);
    try {
      await createRoom(trimmed);
      // Navigation happens in DraftLobbyPage via a useEffect watching state.roomId
    } catch {
      toast.error('Could not create room. Is the server running?');
    } finally {
      setCreateLoading(false);
    }
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = joinName.trim();
    const trimmedCode = joinCode.trim().toUpperCase();

    if (!trimmedName) {
      toast.error('Please enter your name.');
      return;
    }
    if (!trimmedCode) {
      toast.error('Please enter a room code.');
      return;
    }

    setJoinLoading(true);
    try {
      joinRoom(trimmedCode, trimmedName);
      navigate(`/draft/${trimmedCode}`);
    } catch {
      toast.error('Could not join room. Check the room code and try again.');
      setJoinLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-primary-text">NBA All-Time Draft</h1>
        <p className="mt-2 text-text-muted">Assemble your all-time roster with friends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Create a room */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Create a Room</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-name" className="text-sm font-medium">
                Your name
              </label>
              <Input
                id="create-name"
                placeholder="e.g. Jordan"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                maxLength={32}
                autoComplete="off"
              />
            </div>
            <Button type="submit" disabled={createLoading} className="w-full">
              {createLoading ? 'Creating…' : 'Create Room'}
            </Button>
          </form>
        </Card>

        {/* Join a room */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Join a Room</h2>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="join-name" className="text-sm font-medium">
                Your name
              </label>
              <Input
                id="join-name"
                placeholder="e.g. Bird"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                maxLength={32}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="join-code" className="text-sm font-medium">
                Room code
              </label>
              <Input
                id="join-code"
                placeholder="e.g. XYZ12"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={8}
                autoComplete="off"
                className="uppercase tracking-widest font-mono"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={joinLoading} className="w-full">
              {joinLoading ? 'Joining…' : 'Join Room'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
