import { DraftProvider } from '@/context/draftcontext';
import { ReactNode } from 'react';

/**
 * Layout for all `/draft` routes.
 *
 * Wraps children with `DraftProvider` so that both the entrance page and
 * the room page share the same socket context instance.
 */
export default function DraftLayout({ children }: { children: ReactNode }) {
  return <DraftProvider>{children}</DraftProvider>;
}
