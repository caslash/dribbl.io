'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-400">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-500 max-w-md">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
