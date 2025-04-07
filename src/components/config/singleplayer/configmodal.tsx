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
import { GameDifficulties, GameDifficultySchema } from '@/server/lib/models/gamedifficulties';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SinglePlayerConfig } from '@/server/lib/statemachines/singleplayer/gamemachine';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SinglePlayerConfigModal({
  isOpen,
  onConfigureRoom,
}: Readonly<{ isOpen: boolean; onConfigureRoom: (config: SinglePlayerConfig) => void }>) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Single Player</DialogTitle>
        </DialogHeader>
        <SinglePlayerForm onConfigureRoom={onConfigureRoom} />
      </DialogContent>
    </Dialog>
  );
}

function SinglePlayerForm({
  onConfigureRoom,
}: Readonly<{ onConfigureRoom: (config: SinglePlayerConfig) => void }>) {
  const formSchema = z.object({
    gameDifficulty: GameDifficultySchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameDifficulty: GameDifficulties.currentPlayers,
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfigureRoom({ gameDifficulty: values.gameDifficulty })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="gameDifficulty"
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
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Game</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
