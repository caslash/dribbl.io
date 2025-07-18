import { MultiplayerProvider } from '@/context/multiplayercontext';

export default function MultiplayerLayout({ children }: { children: React.ReactNode }) {
  return <MultiplayerProvider>{children}</MultiplayerProvider>;
}
