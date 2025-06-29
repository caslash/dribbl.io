'use client';

import { AvatarEditor } from '@/components/avatar-editor';
import EditProfileModal from '@/components/editprofilemodal';
import { Button } from '@/components/ui/button';
import { useDBUser } from '@/context/dbusercontext';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';

export default function ProfilePage() {
  const { user } = useDBUser();

  return (
    <>
      <div className="flex flex-col h-full items-center space-y-8 pt-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src={user?.profile_url ?? ''}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div className="absolute bottom-0 right-0">
              <AvatarEditor>
                <Button variant="outline" size="icon" className="rounded-full size-8">
                  <Pencil />
                </Button>
              </AvatarEditor>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <span className="text-2xl font-bold">Hello {user?.name}!</span>
            <span className="text-sm text-muted-foreground">{`@${user?.display_name}`}</span>
          </div>

          <EditProfileModal />
        </div>
        <div>
          <Button asChild>
            <NextLink href="/auth/logout">Logout</NextLink>
          </Button>
        </div>
      </div>
    </>
  );
}
