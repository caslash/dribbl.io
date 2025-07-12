'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hostSchema, joinSchema } from '@/lib/schemas';
import {
  GameDifficulties,
  GameDifficultyNames,
  GameDifficultySchema,
  HostFormValues,
  JoinFormValues,
  MultiplayerConfig,
} from '@dribblio/types';
import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from 'react-hook-form';

export default function JoinHostModal({
  isOpen,
  onJoinRoom,
  onHostRoom,
}: Readonly<{
  isOpen: boolean;
  onJoinRoom: (roomId: string) => void;
  onHostRoom: (config: MultiplayerConfig) => void;
}>) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Join or Host a Game</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="join">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join Room</TabsTrigger>
            <TabsTrigger value="host">Host Room</TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <JoinForm onJoinRoom={onJoinRoom} />
          </TabsContent>
          <TabsContent value="host">
            <HostForm onHostRoom={onHostRoom} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function JoinForm({
  onJoinRoom,
}: Readonly<{
  onJoinRoom: (roomId: string) => void;
}>) {
  const form = useForm<JoinFormValues>({
    resolver: joiResolver(joinSchema),
    defaultValues: {
      roomId: '',
    },
  });

  function onSubmit(values: JoinFormValues) {
    onJoinRoom(values.roomId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Code</FormLabel>
                <FormControl>
                  <Input placeholder="Room Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Join Room</Button>
        </div>
      </form>
    </Form>
  );
}

function HostForm({
  onHostRoom,
}: Readonly<{
  onHostRoom: (config: MultiplayerConfig) => void;
}>) {
  const form = useForm<HostFormValues>({
    resolver: joiResolver(hostSchema),
    defaultValues: {
      isRoundLimit: false,
      config: {
        scoreLimit: 10,
        roundLimit: 10,
        roundTimeLimit: 30,
        gameDifficulty: GameDifficulties.firstAllNBA.name,
      },
    },
  });

  function onSubmit(values: HostFormValues) {
    const config: MultiplayerConfig = values.isRoundLimit
      ? {
          roundLimit: values.config.roundLimit!,
          roundTimeLimit: values.config.roundTimeLimit,
          gameDifficulty: GameDifficultySchema.parse(values.config.gameDifficulty),
        }
      : {
          scoreLimit: values.config.scoreLimit!,
          roundTimeLimit: values.config.roundTimeLimit,
          gameDifficulty: GameDifficultySchema.parse(values.config.gameDifficulty),
        };
    onHostRoom(config);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4 self-center">
            <p>Score Limit</p>
            <FormField
              control={form.control}
              name="isRoundLimit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <p>Round Limit</p>
          </div>
          {form.watch('isRoundLimit') && (
            <FormField
              control={form.control}
              name="config.roundLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Round Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Round Limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!form.watch('isRoundLimit') && (
            <FormField
              control={form.control}
              name="config.scoreLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Score Limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="config.roundTimeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Time Limit</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Round Time Limit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="config.gameDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GameDifficultyNames.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {GameDifficultySchema.parse(mode).display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Create Room</Button>
        </div>
      </form>
    </Form>
  );
}
