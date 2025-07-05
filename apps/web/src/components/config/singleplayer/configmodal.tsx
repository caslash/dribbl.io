'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { singlePlayerConfigSchema } from '@/lib/schemas';
import {
  GameDifficulties,
  GameDifficultyNames,
  GameDifficultySchema,
  SinglePlayerConfig,
  SinglePlayerFormValues,
} from '@dribblio/types';
import { joiResolver } from '@hookform/resolvers/joi';
import { Switch } from '@radix-ui/react-switch';
import { useForm } from 'react-hook-form';

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
  const form = useForm<SinglePlayerFormValues>({
    resolver: joiResolver(singlePlayerConfigSchema),
    defaultValues: {
      hasUnlimitedLives: false,
      gameDifficulty: GameDifficulties.currentPlayers.name,
    },
  });

  function onSubmit(values: SinglePlayerFormValues) {
    const lives = values.hasUnlimitedLives ? undefined : 5;

    onConfigureRoom({
      lives,
      gameDifficulty: GameDifficultySchema.parse(values.gameDifficulty),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="hasUnlimitedLives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unlimited Lives?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gameDifficulty"
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
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Game</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
