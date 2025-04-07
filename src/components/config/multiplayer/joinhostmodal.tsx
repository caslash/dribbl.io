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
import { GameDifficulties, GameDifficultySchema } from '@/server/lib/models/gamedifficulties';
import { MultiplayerConfig } from '@/server/lib/statemachines/multiplayer/gamemachine';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateUsername } from 'unique-username-generator';
import { z } from 'zod';

export default function JoinHostModal({
  isOpen,
  onJoinRoom,
  onHostRoom,
}: Readonly<{
  isOpen: boolean;
  onJoinRoom: (roomId: string, name: string) => void;
  onHostRoom: (name: string, config: MultiplayerConfig) => void;
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
  onJoinRoom: (roomId: string, name: string) => void;
}>) {
  const formSchema = z.object({
    name: z
      .string()
      .nonempty({
        message: 'Must enter a name.',
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
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
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
  onHostRoom: (name: string, config: MultiplayerConfig) => void;
}>) {
  const formSchema = z
    .object({
      name: z
        .string()
        .nonempty({
          message: 'Must enter a name.',
        })
        .max(16),
      isRoundLimit: z.boolean(),
      config: z.object({
        scoreLimit: z.coerce.number().optional(),
        roundLimit: z.coerce.number().optional(),
        roundTimeLimit: z.coerce.number(),
        gameDifficulty: GameDifficultySchema,
      }),
    })
    .superRefine((data, ctx) => {
      if (data.isRoundLimit && data.config.roundLimit == 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Round Limit is required when Round Limit mode is selected',
          path: ['config.roundLimit'],
        });
      } else if (!data.isRoundLimit && data.config.scoreLimit == 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Score Limit is required when Score Limit mode is selected',
          path: ['config.scoreLimit'],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: generateUsername('', 0, 16),
      isRoundLimit: false,
      config: {
        scoreLimit: undefined,
        roundLimit: undefined,
        roundTimeLimit: 30,
        gameDifficulty: GameDifficulties.firstAllNBA,
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    values.config = {
      ...values.config,
      scoreLimit: values.isRoundLimit ? undefined : values.config.scoreLimit,
      roundLimit: values.isRoundLimit ? values.config.roundLimit : undefined,
    };
    onHostRoom(values.name, values.config);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
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
            ></FormField>
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
            ></FormField>
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
            ></FormField>
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
          ></FormField>
          <FormField
            control={form.control}
            name="config.gameDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.name}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select game difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GameDifficulties.allModes.map((mode) => (
                      <SelectItem key={mode.name} value={mode.name}>
                        {mode.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Create Room</Button>
        </div>
      </form>
    </Form>
  );
}
