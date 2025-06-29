import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDBUser } from '@/context/dbusercontext';
import { updateUserSchema } from '@/lib/schemas';
import { UpdateUserDto } from '@dribblio/types';
import { joiResolver } from '@hookform/resolvers/joi';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function EditProfileModal() {
  const { user, updateUser } = useDBUser();

  const form = useForm<UpdateUserDto>({
    resolver: joiResolver(updateUserSchema),
    defaultValues: {
      display_name: user?.display_name ?? '',
      name: user?.name ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      display_name: user?.display_name ?? '',
      name: user?.name ?? '',
    });
  }, [user, form]);

  return (
    <Dialog>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button variant="ghost">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((values: UpdateUserDto) => {
              console.log('values', values);
              updateUser(values);
            })}
          >
            <div className="flex flex-col space-y-4 mb-4">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
