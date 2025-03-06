'use client';

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
import { User } from '@/server/lib/models/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generateUsername } from 'unique-username-generator';
import { z } from 'zod';

export default function Game() {
  const [userName, setUserName] = useState<string>('');
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const { socketId, isConnected, roomId, canStartGame, users, onHostRoom, onJoinRoom } =
    useMultiplayerSocket();

  function RoomForm() {
    const formSchema = z.object({
      name: z
        .string()
        .nonempty({
          message: 'Must enter a name to display.',
        })
        .max(16),
      roomId: z.string().max(4),
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
        {users.some((user) => user) && (
          <div>
            <p>Users:</p>
            <ul>
              {users.map((user: User) => (
                <li>
                  <div className="flex flex-row space-x-2">
                    <p>{user.name}</p>
                    {user.id === socketId && <Star />}
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
    </div>
  );
}
