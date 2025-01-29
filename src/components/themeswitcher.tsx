'use client';

import { Switch } from '@heroui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@/icons/themes';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), [setMounted]);

  if (!mounted) return null;

  const updateTheme = (isSelected: boolean) => {
    setTheme(isSelected ? 'dark' : 'light');
  };

  return (
    <Switch
      color="default"
      size="lg"
      isSelected={theme === 'dark'}
      onValueChange={updateTheme}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? <MoonIcon className={className} /> : <SunIcon className={className} />
      }
    />
  );
}
