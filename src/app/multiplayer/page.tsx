'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useMultiplayerSocket from '@/hooks/useMultiplayerSocket';
import { UserGameInfo } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateUsername } from 'unique-username-generator';
import { z } from 'zod';

export default function Game() {
  const {
    isConnected,
    roomId,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
    onGuess,
    timeLeft,
  } = useMultiplayerSocket();

  function RoomForm() {
    const formSchema = z.object({
      name: z
        .string()
        .nonempty({
          message: 'Must enter a name to display.',
        })
        .max(16),
      roomId: z.string().max(5),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: generateUsername('', 0, 16),
        roomId: '',
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      onJoinRoom(values.roomId, values.name);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Room Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">Join Room</Button>
            <Button type="button" onClick={() => onHostRoom(form.getValues().name)}>
              Host Room
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        {roomId && <p>{`Room Code: ${roomId}`}</p>}
        {users.some((user: UserGameInfo) => user) && (
          <div>
            <p>Users:</p>
            <ul>
              {users.map((user: UserGameInfo) => (
                <li key={user.info.id}>
                  <div className="flex flex-row space-x-2">
                    <p>{user.info.name}</p>
                    <p>{user.score}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!roomId && (
        <div className="w-full flex flex-col items-center space-y-4">
          <RoomForm />
        </div>
      )}

      {canStartGame && (
        <div>
          <Button onClick={onStartGame}>Start Game</Button>
        </div>
      )}

      {teams && (
        <div className="w-full flex flex-col items-center space-y-8">
          <p className="text-2xl font-bold">Time Left: {timeLeft}</p>
          <CareerPath teams={teams} />
          <PlayerSearchBar playerList={players} onSelect={onGuess} />
        </div>
      )}
    </div>
  );
}
