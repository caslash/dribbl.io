'use client';

import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@/icons/themes';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), [setMounted]);

  if (!mounted) return null;

  const updateTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button onClick={updateTheme} variant="ghost" size="icon" className="rounded-full">
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
