import { SinglePlayerProvider } from '@/context/singleplayercontext';

export default function SinglePlayerLayout({ children }: { children: React.ReactNode }) {
  return <SinglePlayerProvider>{children}</SinglePlayerProvider>;
}
