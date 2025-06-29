This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.cursor/
  rules/
    clean-code.mdc
    codequality.mdc
    nestjs.mdc
    nextjs.mdc
    reference-file.mdc
    tailwind.mdc
    typescript.mdc
apps/
  api/
    src/
      auth/
        auth.module.ts
        jwt.strategy.ts
        payload.type.ts
        userinfo.type.ts
      database/
        database.module.ts
        nba.prisma.service.ts
        users.prisma.service.ts
      nba/
        games/
          careerpath/
            room/
              factory.service.ts
              room.service.spec.ts
              room.service.ts
            careerpath.gateway.ts
            careerpath.module.ts
            game.service.ts
        player/
          player.controller.ts
          player.module.ts
          player.service.ts
        nba.module.ts
      users/
        avatar.service.ts
        s3.service.ts
        signedurl.inteceptor.ts
        users.controller.ts
        users.module.ts
        users.service.ts
      app.module.ts
      main.ts
    test/
      app.e2e-spec.ts
      jest-e2e.json
    eslint.config.mjs
    jest.lint.config.ts
    nest-cli.json
    package.json
    README.md
    tsconfig.build.json
    tsconfig.json
  web/
    src/
      app/
        login/
          page.tsx
        multiplayer/
          page.tsx
        profile/
          page.tsx
        singleplayer/
          page.tsx
        layout.tsx
        page.tsx
        providers.tsx
      components/
        careerpath/
          answer.tsx
          careerpathview.tsx
        config/
          multiplayer/
            joinhostmodal.tsx
          singleplayer/
            configmodal.tsx
        magicui/
          dock.tsx
        navbar/
          navbar.tsx
          themeswitcher.tsx
        search/
          playersearchbar.tsx
          playersearchresult.tsx
        ui/
          avatar.tsx
          button.tsx
          card.tsx
          command.tsx
          dialog.tsx
          form.tsx
          input.tsx
          label.tsx
          select.tsx
          separator.tsx
          switch.tsx
          tabs.tsx
          tooltip.tsx
        avatar-editor.tsx
        editprofilemodal.tsx
        gamemodecard.tsx
        login-form.tsx
        teamlogo.tsx
      config/
        site.ts
      context/
        dbusercontext.tsx
      hooks/
        useConfetti.ts
        useMultiplayerSocket.ts
        usePlayerSearch.ts
        useSinglePlayerSocket.ts
        useUnveilLogos.ts
      icons/
        iconsvgprops.tsx
        themes.tsx
      lib/
        auth0.ts
        clientsocket.ts
        schemas.ts
        utils.ts
      styles/
        globals.css
        sfFont.ts
      middleware.ts
    components.json
    eslint.config.js
    jest.lint.config.ts
    next.config.mjs
    package.json
    postcss.config.js
    postcss.config.mjs
    README.md
    tailwind.config.ts
    tsconfig.json
packages/
  database/
    prisma-nba/
      schema.prisma
    prisma-users/
      migrations/
        20250618014712_add_users_table/
          migration.sql
        migration_lock.toml
      schema.prisma
    src/
      client.ts
      index.ts
    .gitignore
    package.json
    tsconfig.json
  eslint-config/
    base.js
    next.js
    package.json
    README.md
  types/
    src/
      dtos/
        index.ts
        updateuser.dto.ts
      forms/
        hostform.ts
        index.ts
        joinform.ts
      responses/
        index.ts
        searchresponse.ts
      statemachine/
        multiplayer/
          actions.ts
          gamemachine.ts
          guards.ts
          index.ts
        singleplayer/
          actions.ts
          gamemachine.ts
          guards.ts
          index.ts
        actors.ts
        gamedifficulties.ts
        gameservice.ts
        index.ts
      websocket/
        index.ts
        messagebodies.ts
        playerguess.ts
        room.ts
      index.ts
    package.json
    tsconfig.json
  typescript-config/
    base.json
    nextjs.json
    package.json
    react-library.json
.gitignore
.prettierrc
.repomixignore
package.json
README.md
repomix.config.json
turbo.json
```

# Files

## File: .cursor/rules/nestjs.mdc
````
---
description: 
globs: apps/api/**/*.ts
alwaysApply: false
---
You are a senior TypeScript programmer with experience in the NestJS framework and a preference for clean programming and design patterns. Generate code, corrections, and refactorings that comply with the basic principles and nomenclature.

## TypeScript General Guidelines

### Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
- Avoid using any.
- Create necessary types.
- Use JSDoc to document public classes and methods.
- Don't leave blank lines within a function.
- One export per file.

### Nomenclature

- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
- Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling.
- Except for standard abbreviations like API, URL, etc.
- Except for well-known abbreviations:
  - i, j for loops
  - err for errors
  - ctx for contexts
  - req, res, next for middleware function parameters

### Functions

- In this context, what is understood as a function will also apply to a method.
- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
- If it returns a boolean, use isX or hasX, canX, etc.
- If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting.
- Use arrow functions for simple functions (less than 3 instructions).
- Use named functions for non-simple functions.
- Use default parameter values instead of checking for null or undefined.
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters.
  - Use an object to return results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.

### Data

- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
- Use readonly for data that doesn't change.
- Use as const for literals that don't change.

### Classes

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
  - Less than 200 instructions.
  - Less than 10 public methods.
  - Less than 10 properties.

### Exceptions

- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.

### Testing

- Follow the Arrange-Act-Assert convention for tests.
- Name test variables clearly.
- Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function.
- Use test doubles to simulate dependencies.
  - Except for third-party dependencies that are not expensive to execute.
- Write acceptance tests for each module.
- Follow the Given-When-Then convention.

## Specific to NestJS

### Basic Principles

- Use modular architecture
- Encapsulate the API in modules.
  - One module per main domain/route.
  - One controller for its route.
  - And other controllers for secondary routes.
  - A models folder with data types.
  - DTOs validated with class-validator for inputs.
  - Declare simple types for outputs.
  - A services module with business logic and persistence.
  - Entities with MikroORM for data persistence.
  - One service per entity.
- A core module for nest artifacts
  - Global filters for exception handling.
  - Global middlewares for request management.
  - Guards for permission management.
  - Interceptors for request management.
- A shared module for services shared between modules.
  - Utilities
  - Shared business logic

### Testing

- Use the standard Jest framework for testing.
- Write tests for each controller and service.
- Write end to end tests for each api module.
- Add a admin/test method to each controller as a smoke test.
````

## File: .cursor/rules/reference-file.mdc
````
---
description: 
globs: 
alwaysApply: true
---
Reference the summary of the repo in the `docs/repo.md` file before responding to every prompt. This file will provide all context of the current state of the project. Read and analyze the file before responding, then respond using the knowledge and context acquired from the markdown file.
````

## File: apps/api/src/auth/userinfo.type.ts
````typescript
export type UserInfo = {
  sub: string;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
  updated_at: string;
};
````

## File: apps/api/src/database/nba.prisma.service.ts
````typescript
import { nba } from '@dribblio/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class NBAPrismaService extends nba.PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
````

## File: apps/api/src/database/users.prisma.service.ts
````typescript
import { users } from '@dribblio/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class UsersPrismaService extends users.PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
````

## File: apps/api/src/users/signedurl.inteceptor.ts
````typescript
import { AvatarService } from '@/users/avatar.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { from, map, mergeMap, Observable, of } from 'rxjs';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
  constructor(private readonly avatarService: AvatarService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((user) => {
        if (!user || !user.profile_url) {
          return of(user);
        }

        return from(this.avatarService.getSignedUrl(user.profile_url)).pipe(
          map((signedUrl) => ({ ...user, profile_url: signedUrl })),
        );
      }),
    );
  }
}
````

## File: apps/api/test/jest-e2e.json
````json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
````

## File: apps/api/jest.lint.config.ts
````typescript
const config = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: ['<rootDir>/**/*.{js,ts}'],
};

export default config;
````

## File: apps/api/nest-cli.json
````json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
````

## File: apps/api/tsconfig.build.json
````json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
````

## File: apps/web/src/components/careerpath/careerpathview.tsx
````typescript
'use client';
import Image from 'next/image';

export function CareerPath({ teams }: Readonly<{ teams?: string[] }>) {
  const containerKey = teams?.join('-') || 'empty';

  return (
    <div key={containerKey}>
      <div className="flex flex-row">
        {teams?.map((id: string, index: number) => (
          <Image
            key={`${id}-${index}`}
            alt={`logo-${id}`}
            src={`/logos/${id}.svg`}
            className={`${id === '1610612762' ? 'dark:invert' : ''}`}
            width={100}
            height={100}
          />
        ))}
      </div>
    </div>
  );
}
````

## File: apps/web/src/components/magicui/dock.tsx
````typescript
'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import React, { PropsWithChildren, useRef } from 'react';

import { cn } from '@/lib/utils';

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: 'top' | 'middle' | 'bottom';
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  'supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md',
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = 'middle',
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          'items-start': direction === 'top',
          'items-center': direction === 'middle',
          'items-end': direction === 'bottom',
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = 'Dock';

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        'flex aspect-square cursor-pointer items-center justify-center rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = 'DockIcon';

export { Dock, DockIcon, dockVariants };
````

## File: apps/web/src/components/navbar/themeswitcher.tsx
````typescript
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
````

## File: apps/web/src/components/ui/avatar.tsx
````typescript
'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
````

## File: apps/web/src/components/ui/button.tsx
````typescript
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
````

## File: apps/web/src/components/ui/command.tsx
````typescript
'use client';

import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
````

## File: apps/web/src/components/ui/dialog.tsx
````typescript
'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
````

## File: apps/web/src/components/ui/form.tsx
````typescript
'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
````

## File: apps/web/src/components/ui/input.tsx
````typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
````

## File: apps/web/src/components/ui/label.tsx
````typescript
'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
````

## File: apps/web/src/components/ui/separator.tsx
````typescript
'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
````

## File: apps/web/src/components/ui/tooltip.tsx
````typescript
'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
````

## File: apps/web/src/components/avatar-editor.tsx
````typescript
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDBUser } from '@/context/dbusercontext';
import { Crop as CropIcon, Upload, X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface AvatarEditorProps {
  children: React.ReactNode;
}

export function AvatarEditor({ children }: AvatarEditorProps) {
  const { uploadAvatar } = useDBUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL('image/png', 1.0);
  }

  async function handleCropAndUpload() {
    if (!croppedImageUrl) return;

    try {
      setIsUploading(true);

      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.png', { type: 'image/png' });

      await uploadAvatar(file);

      setDialogOpen(false);
      setSelectedFile(null);
      setCroppedImageUrl('');
      setCrop(undefined);

      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleCancel() {
    setDialogOpen(false);
    setSelectedFile(null);
    setCroppedImageUrl('');
    setCrop(undefined);

    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-sm text-muted-foreground">Drop the image here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload an image</p>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, GIF, WebP (max 5MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={onCropComplete}
                  aspect={1}
                  className="w-full"
                >
                  <img
                    ref={imgRef}
                    src={selectedFile.preview}
                    alt="Crop preview"
                    className="max-h-96 w-full object-contain"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Drag to move, resize corners to crop. The image will be cropped to a 100x100 square.
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {selectedFile && (
              <Button onClick={handleCropAndUpload} disabled={!croppedImageUrl || isUploading}>
                <CropIcon className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Save Avatar'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
````

## File: apps/web/src/components/editprofilemodal.tsx
````typescript
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
````

## File: apps/web/src/components/gamemodecard.tsx
````typescript
import { Button } from '@/components/ui/button';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Url } from 'next/dist/shared/lib/router/router';
import Image from 'next/image';
import Link from 'next/link';

export default function GameModeCard({
  className,
  title,
  description,
  href,
  imageHref,
}: Readonly<{
  className?: string;
  title: string;
  description: string;
  href: Url;
  imageHref: string | StaticImport;
}>) {
  return (
    <div
      className={`${className} flex rounded-lg border filter grayscale hover:grayscale-0 transition-all duration-300 relative`}
    >
      <div className="-z-100 h-full w-full">
        <Image src={imageHref} alt={`${title}-image`} fill className="object-cover rounded-lg" />
      </div>

      <div className="self-end w-full flex justify-between items-end p-8 absolute rounded-b-lg bg-gradient-to-t from-black to-transparent backdrop-blur-md">
        <div>
          <p className="text-white font-black text-xl">{title}</p>
          <p className="text-white text-sm">{description}</p>
        </div>

        <Button variant="ghost" className="align-center rounded-full text-white" asChild>
          <Link href={href}>Play</Link>
        </Button>
      </div>
    </div>
  );
}
````

## File: apps/web/src/components/teamlogo.tsx
````typescript
'use client';
import Image from 'next/image';

export default function TeamLogo({
  className,
  isHidden,
  teamId,
}: Readonly<{ className?: string; isHidden: boolean; teamId: string }>) {
  return (
    <div className={`relative ${className}`}>
      <Image
        hidden={isHidden}
        alt={`logo-${teamId}`}
        src={`/logos/${teamId}.svg`}
        className={`absolute inset-0 ${teamId === '1610612762' ? 'dark:invert' : ''}`}
        width={100}
        height={100}
      />
      <svg className="" height={100} width={100} xmlns="http://www.w3.org/2000/svg">
        <rect height="100%" width="100%" fillOpacity={0} />
      </svg>
    </div>
  );
}
````

## File: apps/web/src/hooks/useConfetti.ts
````typescript
import confetti from 'canvas-confetti';

const useConfetti = () => {
  const onConfetti = () => {
    const end: number = Date.now() + 1 * 1000;
    const colors: string[] = ['#1d428a', '#c8102e', '#ffffff'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return { onConfetti };
};

export default useConfetti;
````

## File: apps/web/src/hooks/useUnveilLogos.ts
````typescript
import { useState } from 'react';

const useUnveilLogos = (teamHistory: string[]) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const indexArr: number[] = Array.from(Array(teamHistory.length).keys());
  let remainingTeams = [...indexArr];

  const unveilRandomLogoIndex = (unveilInterval: NodeJS.Timeout) => {
    if (remainingTeams.length === 0) {
      clearInterval(unveilInterval);
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingTeams.length);
    const selectedTeam: number = remainingTeams[randomIndex]!;

    remainingTeams = remainingTeams.splice(randomIndex, 1);

    console.log(`Unveiling team #${selectedTeam + 1}`);
    setVisibleIndexes((prev) => [...prev, selectedTeam]);
  };

  return { visibleIndexes, unveilRandomLogoIndex };
};

export default useUnveilLogos;
````

## File: apps/web/src/icons/iconsvgprops.tsx
````typescript
import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
````

## File: apps/web/src/icons/themes.tsx
````typescript
'use client';

import { IconSvgProps } from '@/icons/iconsvgprops';

export const MoonIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SunIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
};
````

## File: apps/web/src/lib/auth0.ts
````typescript
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE,
  },
});
````

## File: apps/web/src/lib/clientsocket.ts
````typescript
'use client';

import { io } from 'socket.io-client';

export const clientSocket = io(`http://localhost:3002`, {
  autoConnect: false,
});
````

## File: apps/web/src/styles/sfFont.ts
````typescript
import localFont from 'next/font/local';

export const sfFont = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Pro-Display-Ultralight.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-UltralightItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Thin.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-ThinItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-SemiboldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Heavy.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-HeavyItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-sf',
});
````

## File: apps/web/jest.lint.config.ts
````typescript
const config = {
  runner: 'jest-runner-eslint',
  displayName: 'lint',
  testMatch: ['<rootDir>/src/**/*.ts(x)'],
};

export default config;
````

## File: apps/web/postcss.config.js
````javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
````

## File: apps/web/postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: packages/database/prisma-nba/schema.prisma
````
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma-nba"
}

generator json {
  provider = "prisma-json-types-generator"
}

datasource db {
  provider = "postgresql"
  url      = env("NBA_DATABASE_URL")
}

model Player {
  id                 Int               @id(map: "idx_16392_player_pkey")
  first_name         String?
  last_name          String?
  display_first_last String?
  display_fi_last    String?
  birthdate          DateTime?         @db.Timestamp(6)
  school             String?
  country            String?
  height             String?
  weight             String?
  season_exp         Int?
  jersey             String?
  position           String?
  team_history       String?
  is_active          Boolean?
  from_year          Int?
  to_year            Int?
  total_games_played Int?
  draft_round        String?
  draft_number       String?
  draft_year         String?
  player_accolades   player_accolades?

  @@map("player")
}

model player_accolades {
  player_id Int    @id(map: "idx_16397_player_accolades_pkey")
  /// [PlayerAccoladeList]
  accolades Json?
  player    Player @relation(fields: [player_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}
````

## File: packages/database/prisma-users/migrations/20250618014712_add_users_table/migration.sql
````sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "display_name" TEXT,
    "name" TEXT,
    "profile_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
````

## File: packages/database/prisma-users/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: packages/database/tsconfig.json
````json
{
  "extends": "@dribblio/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
````

## File: packages/eslint-config/README.md
````markdown
# `@turbo/eslint-config`

Collection of internal eslint configurations.
````

## File: packages/types/src/dtos/index.ts
````typescript
export * from './updateuser.dto.js';
````

## File: packages/types/src/dtos/updateuser.dto.ts
````typescript
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  display_name?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
````

## File: packages/types/src/forms/hostform.ts
````typescript
export type HostFormValues = {
  isRoundLimit: boolean;
  config: {
    scoreLimit?: number;
    roundLimit?: number;
    roundTimeLimit: number;
    gameDifficulty: string;
  };
};
````

## File: packages/types/src/forms/index.ts
````typescript
export * from './hostform.js';
export * from './joinform.js';
````

## File: packages/types/src/forms/joinform.ts
````typescript
export type JoinFormValues = {
  roomId: string;
};
````

## File: packages/types/src/responses/index.ts
````typescript
export * from './searchresponse.js';
````

## File: packages/types/src/statemachine/gameservice.ts
````typescript
import { RoundProps } from './actors.js';
import { GameDifficulty } from './gamedifficulties.js';

export interface BaseGameService {
  generateRound: (difficulty: GameDifficulty) => Promise<RoundProps>;
}
````

## File: packages/types/src/websocket/playerguess.ts
````typescript
export type PlayerGuess = {
  userId: string;
  guessId: number;
};
````

## File: packages/typescript-config/nextjs.json
````json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true
  }
}
````

## File: packages/typescript-config/package.json
````json
{
  "name": "@dribblio/typescript-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  }
}
````

## File: packages/typescript-config/react-library.json
````json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
````

## File: .prettierrc
````
singleQuote: true
printWidth: 100
trailingComma: all
endOfLine: auto
tabWidth: 2
````

## File: apps/api/src/auth/auth.module.ts
````typescript
import { JwtStrategy } from '@/auth/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
````

## File: apps/api/src/auth/payload.type.ts
````typescript
export type Auth0JwtPayload = {
  aud: string; // Audience (API identifier)
  azp?: string; // Authorized party
  exp: number; // Expiration time
  iat: number; // Issued at time
  iss: string; // Issuer (Auth0 domain)
  scope?: string; // Scopes granted
  sub: string; // Subject (user ID)
};
````

## File: apps/api/src/nba/games/careerpath/room/room.service.spec.ts
````typescript
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
````

## File: apps/api/src/users/avatar.service.ts
````typescript
import { S3Service } from '@/users/s3.service';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarService {
  private readonly urlExpirySeconds = 15 * 60;

  constructor(private readonly s3Service: S3Service) {}

  private async getCloudFrontPrivateKey() {
    const secret_name = process.env.AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME;

    const client = new SecretsManagerClient({ region: 'us-east-2' });

    let response;

    try {
      response = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));
    } catch (error) {
      console.error(error);
      throw error;
    }

    if ('SecretString' in response) {
      return response.SecretString;
    }

    throw new Error('Failed to get CloudFront private key');
  }

  // TODO: Move signed url logic to controller with a interceptor
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const now = new Date().toISOString();
    await this.s3Service.uploadFile(`${userId}-${now}`, file.buffer);

    const encodedUserId = encodeURIComponent(userId);
    const encodedDate = encodeURIComponent(now);

    const unsignedUrl = `https://${process.env.AWS_CLOUDFRONT_CNAME}/${encodedUserId}-${encodedDate}.jpg`;

    return unsignedUrl;
  }

  async getSignedUrl(unsignedUrl: string) {
    const nowMs = Date.now();
    const expiryDate = new Date(nowMs + this.urlExpirySeconds * 1000);

    const privateKey = await this.getCloudFrontPrivateKey();

    const signedUrl = getSignedUrl({
      url: unsignedUrl,
      keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID ?? '',
      dateLessThan: expiryDate,
      privateKey,
    });

    return signedUrl;
  }
}
````

## File: apps/api/src/users/s3.service.ts
````typescript
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3Client) {}

  async uploadFile(userId: string, file: Buffer) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params: {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `avatars/${userId}.jpg`,
          Body: file,
        },
      });

      await parallelUploads3.done();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
````

## File: apps/api/test/app.e2e-spec.ts
````typescript
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
````

## File: apps/api/eslint.config.mjs
````
import { baseConfig } from '@dribblio/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default baseConfig;
````

## File: apps/api/tsconfig.json
````json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
````

## File: apps/web/src/app/login/page.tsx
````typescript
import { GalleryVerticalEnd } from 'lucide-react';

import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
````

## File: apps/web/src/app/layout.tsx
````typescript
import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar/navbar';
import { sfFont } from '@/styles/sfFont';
import { ReactNode } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sfFont.variable}`} suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <nav className="fixed top-0 left-0 w-full z-10 flex justify-center z-[100] pointer-events-auto">
            <NBANavbar className="w-auto top-8" />
          </nav>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            closeOnClick
            newestOnTop
            pauseOnHover
            closeButton={false}
            transition={Bounce}
          />
          <main>
            <div className="h-dvh w-full p-16">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
````

## File: apps/web/src/app/providers.tsx
````typescript
'use client';

import { DBUserProvider } from '@/context/dbusercontext';
import type { ThemeProviderProps } from 'next-themes';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <DBUserProvider>{children}</DBUserProvider>
    </NextThemesProvider>
  );
}
````

## File: apps/web/src/components/careerpath/answer.tsx
````typescript
'use client';

import { nba } from '@dribblio/database';
import NextImage from 'next/image';

const CorrectAnswer = ({
  correctPlayer,
  validAnswers,
}: Readonly<{ correctPlayer?: nba.Player; validAnswers?: nba.Player[] }>) => {
  return (
    <div className="flex flex-col items-center">
      {correctPlayer && (
        <div>
          <p className="text-center">
            Correct! <span className="font-black">{correctPlayer.display_first_last}</span> was a
            correct answer.
          </p>
          <NextImage
            alt={`player-image-${correctPlayer.id}`}
            src={`https://cdn.nba.com/headshots/nba/latest/260x190/${correctPlayer.id}.png`}
            width={260}
            height={190}
          />
        </div>
      )}
      {validAnswers && (
        <div>
          <p className="text-center">Correct! Possible answers include:</p>

          <div className="flex flex-col items-center">
            {validAnswers.map((player) => (
              <div className="flex flex-row items-center" key={player.id}>
                <NextImage
                  alt={`player-image-${player.id}`}
                  src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
                  width={65}
                  height={47.5}
                />
                <p>{player.display_first_last}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const IncorrectAnswer = ({ possibleAnswers }: Readonly<{ possibleAnswers: nba.Player[] }>) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-center">Incorrect, the possible answers were:</p>
      <div className="flex flex-col items-center">
        {possibleAnswers.map((player) => (
          <div className="flex flex-row items-center" key={player.id}>
            <NextImage
              alt={`player-image-${player.id}`}
              src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
              width={65}
              height={47.5}
            />
            <p>{player.display_first_last}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CorrectAnswer, IncorrectAnswer };
````

## File: apps/web/src/components/config/singleplayer/configmodal.tsx
````typescript
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
import {
  GameDifficulties,
  GameDifficultyNames,
  GameDifficultySchema,
  SinglePlayerConfig,
} from '@dribblio/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
    gameDifficulty: z.enum(GameDifficultyNames as [string, ...string[]]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameDifficulty: GameDifficulties.currentPlayers.name,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onConfigureRoom({ gameDifficulty: GameDifficultySchema.parse(values.gameDifficulty) });
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
          ></FormField>
          <div className="flex justify-end mt-4">
            <Button type="submit">Create Game</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
````

## File: apps/web/src/components/search/playersearchresult.tsx
````typescript
import { nba } from '@dribblio/database';

export default function PlayerSearchResult({ player }: Readonly<{ player: nba.Player }>) {
  return (
    <div className="flex flex-col justify-start gap-1 py-2">
      <p className="text-base">{player.display_first_last}</p>
      <p className="text-xs">{`${player.from_year}-${player.to_year}`}</p>
    </div>
  );
}
````

## File: apps/web/src/components/ui/card.tsx
````typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
````

## File: apps/web/src/components/ui/select.tsx
````typescript
'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
````

## File: apps/web/src/components/ui/switch.tsx
````typescript
'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
````

## File: apps/web/src/components/ui/tabs.tsx
````typescript
'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
````

## File: apps/web/src/components/login-form.tsx
````typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
````

## File: apps/web/src/context/dbusercontext.tsx
````typescript
'use client';

import { getAccessToken } from '@auth0/nextjs-auth0';
import { User } from '@dribblio/database/generated/prisma-users/client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface DBUserContextType {
  user: User | undefined;

  /**
   * Update user fields in the database and sync local state.
   * @param user - Partial user object with fields to update.
   */
  updateUser: (user: Partial<User>) => void;

  /**
   * Upload a new avatar image to the database and sync local state.
   * @param avatar - The avatar image file to upload.
   */
  uploadAvatar: (avatar: File) => void;
}

const defaultUserContext: DBUserContextType = {
  user: undefined,
  updateUser: () => {},
  uploadAvatar: () => {},
};

const DBUserContext = createContext<DBUserContextType | undefined>(undefined);
export const useDBUser = () => useContext(DBUserContext) ?? defaultUserContext;

export function DBUserProvider({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  const updateUser = useCallback((user: Partial<User>) => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      fetch('/api/me', {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  const uploadAvatar = useCallback((avatar: File) => {
    getAccessToken().then((accessToken) => {
      if (!accessToken) return;

      const formData = new FormData();
      formData.append('avatar', avatar);

      fetch('/api/me/avatar', {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(setUser);
    });
  }, []);

  return (
    <DBUserContext.Provider value={{ user, updateUser, uploadAvatar }}>
      {children}
    </DBUserContext.Provider>
  );
}
````

## File: apps/web/src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
````

## File: apps/web/src/styles/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
````

## File: apps/web/src/middleware.ts
````typescript
import { auth0 } from '@/lib/auth0';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
````

## File: apps/web/components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: apps/web/eslint.config.js
````javascript
import { nextJsConfig } from '@dribblio/eslint-config/next-js';

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig;
````

## File: apps/web/tailwind.config.ts
````typescript
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sf: ['var(--font-sf)'],
      },
      zIndex: {
        60: '60',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  darkMode: ['class'],
  plugins: [require('tailwindcss-animate')],
};
````

## File: packages/database/prisma-users/schema.prisma
````
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma-users"
}

datasource db {
  provider = "postgresql"
  url      = env("USERS_DATABASE_URL")
}

model User {
  id String @id
  display_name String?
  name String?
  profile_url String?
}
````

## File: packages/database/src/client.ts
````typescript
import { PrismaClient as NBAPrismaClient } from '../generated/prisma-nba';
import { PrismaClient as UsersPrismaClient } from '../generated/prisma-users';

const globalForPrisma = global as unknown as {
  users_prisma: UsersPrismaClient;
  nba_prisma: NBAPrismaClient;
};

export const users_prisma = globalForPrisma.users_prisma || new UsersPrismaClient();
export const nba_prisma = globalForPrisma.nba_prisma || new NBAPrismaClient();
````

## File: packages/eslint-config/package.json
````json
{
  "name": "@dribblio/eslint-config",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "exports": {
    "./base": "./base.js",
    "./next-js": "./next.js",
    "./react-internal": "./react-internal.js"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@next/eslint-plugin-next": "^15.3.3",
    "eslint": "^9.25.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-only-warn": "^1.1.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-turbo": "^2.5.0",
    "globals": "^16.2.0",
    "typescript": "^5.8.2",
    "typescript-eslint": "^8.31.0"
  }
}
````

## File: packages/types/src/responses/searchresponse.ts
````typescript
import { nba } from '@dribblio/database';

export interface SearchResponse {
  results: nba.Player[];
}
````

## File: packages/types/src/statemachine/multiplayer/actions.ts
````typescript
import { AnyEventObject } from 'xstate';
import { MultiplayerContext } from './gamemachine.js';

type ActionProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const sendPlayerToRoom = ({ context }: ActionProps) => {
  try {
    const { io, room, gameState } = context;
    const { roundActive, timeLeft, users, validAnswers } = gameState;

    const team_history = validAnswers[0]?.team_history?.split(',');

    io?.to(room.id).emit('next_round', { roundActive, timeLeft, users, team_history });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const sendTimerToRoom = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;
  const { timeLeft } = gameState;

  io?.to(room.id).emit('timer_updated', { timeLeft });
};

export const sendRoundInfoToRoom = ({ context }: ActionProps) => {
  const { io, room, gameState } = context;

  io?.to(room.id).emit('end_round', gameState);
};
````

## File: packages/types/src/statemachine/multiplayer/guards.ts
````typescript
import { AnyEventObject } from 'xstate';
import { MultiplayerContext } from './gamemachine.js';

type GuardProps = {
  context: MultiplayerContext;
  event: AnyEventObject;
};

export const isCorrectMultiplayer = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const timeExpired = ({ context }: GuardProps): boolean => {
  const { timeLeft } = context.gameState;
  return timeLeft <= 0;
};
````

## File: packages/types/src/statemachine/multiplayer/index.ts
````typescript
export * from './actions.js';
export * from './gamemachine.js';
export * from './guards.js';
````

## File: packages/types/src/statemachine/singleplayer/actions.ts
````typescript
import { AnyEventObject } from 'xstate';
import { SinglePlayerContext } from './gamemachine.js';

type ActionProps = {
  context: SinglePlayerContext;
  event: AnyEventObject;
};

export const waitForUser = ({ context }: ActionProps) => {
  try {
    const { socket } = context;

    socket?.emit('waiting_for_user');
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const sendPlayerToClient = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { score, validAnswers, lives } = gameState;

    const team_history = validAnswers[0]?.team_history?.split(',');

    socket?.emit('next_round', { score, team_history, lives: lives + 1 });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyCorrectGuess = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { validAnswers } = gameState;

    socket?.emit('correct_guess', { validAnswers });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyIncorrectGuess = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { lives } = gameState;

    socket?.emit('incorrect_guess', { lives: lives + 1 });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifySkipRound = ({ context }: ActionProps) => {
  try {
    const { socket, gameState } = context;
    const { lives } = gameState;

    socket?.emit('round_skipped', { lives: lives + 1 });
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};

export const notifyGameOver = ({ context }: ActionProps) => {
  try {
    const { socket } = context;

    socket?.emit('game_over');
  } catch (err) {
    throw Error(`Socket could not be found: ${err}`);
  }
};
````

## File: packages/types/src/statemachine/singleplayer/guards.ts
````typescript
import { AnyEventObject } from 'xstate';
import { SinglePlayerContext } from './gamemachine.js';

type GuardProps = {
  context: SinglePlayerContext;
  event: AnyEventObject;
};

export const isCorrectSinglePlayer = ({ context, event }: GuardProps): boolean => {
  const { guessId } = event.guess;
  return !!context.gameState.validAnswers.find((player) => player.id === guessId);
};

export const hasLives = ({ context }: GuardProps): boolean => context.gameState.lives > 0;
````

## File: packages/types/src/statemachine/singleplayer/index.ts
````typescript
export * from './actions.js';
export * from './gamemachine.js';
export * from './guards.js';
````

## File: packages/types/src/statemachine/gamedifficulties.ts
````typescript
import { nba } from '@dribblio/database';
import { z } from 'zod';

const firstAllNBA: nba.Prisma.PlayerWhereInput = {
  AND: [
    {
      team_history: {
        contains: ',',
      },
    },
    {
      from_year: {
        gte: 1980,
      },
    },
    {
      OR: [
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '1',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

const allNBA: nba.Prisma.PlayerWhereInput = {
  AND: [
    {
      team_history: {
        contains: ',',
      },
    },
    {
      from_year: {
        gte: 1980,
      },
    },
    {
      OR: [
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '1',
                },
              ],
            },
          },
        },
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '2',
                },
              ],
            },
          },
        },
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '3',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

const currentPlayers: nba.Prisma.PlayerWhereInput = {
  is_active: {
    equals: true,
  },
};

export class GameDifficulties {
  static firstAllNBA: GameDifficulty = {
    name: 'firstallnba',
    display_name: '1st Team All-NBA Players',
    description: 'Every player that has appeared on the All-NBA 1st team.',
    filter: firstAllNBA,
  };

  static allNBA: GameDifficulty = {
    name: 'allnba',
    display_name: 'All-NBA Players',
    description: 'Every player that had appeard on any All-NBA team.',
    filter: allNBA,
  };

  static currentPlayers: GameDifficulty = {
    name: 'currentplayers',
    display_name: 'Current Players',
    description: 'Every player currently on an NBA roster',
    filter: currentPlayers,
  };

  static allPlayers: GameDifficulty = {
    name: 'allplayers',
    display_name: 'All Players',
    description: 'Every. Single. Player. Ever.',
    filter: {},
  };

  static allModes: GameDifficulty[] = [
    GameDifficulties.firstAllNBA,
    GameDifficulties.allNBA,
    GameDifficulties.currentPlayers,
    GameDifficulties.allPlayers,
  ];
}

export interface GameDifficulty {
  name: string;
  display_name: string;
  description: string;
  filter: nba.Prisma.PlayerWhereInput;
}

export const GameDifficultyNames = GameDifficulties.allModes.map((mode) => mode.name);

export const GameDifficultySchema = z
  .enum([GameDifficultyNames[0]!, ...GameDifficultyNames.slice(1)])
  .transform((val) => {
    const difficulty = GameDifficulties.allModes.find((mode) => mode.name === val);
    return difficulty!;
  });
````

## File: packages/types/src/websocket/messagebodies.ts
````typescript
import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

export interface HostRoomMessageBody {
  isMulti: boolean;
  userId: string;
  config: MultiplayerConfig | SinglePlayerConfig;
}

export interface JoinRoomMessageBody {
  roomId: string;
  userId: string;
}
````

## File: packages/typescript-config/base.json
````json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
````

## File: .repomixignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# Dependencies
node_modules
/pnp
.pnp.js

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage

# Turbo
.turbo

# Vercel
.vercel

# Build Outputs
.next/
out/
build
dist

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.DS_Store
*.pem

# production
/build

# next.js
/.next/
/out/

# typescript
*.tsbuildinfo
next-env.d.ts
**/*-lock.json

*.svg
````

## File: repomix.config.json
````json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "docs/repo.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: .cursor/rules/clean-code.mdc
````
---
description: Guidelines for writing clean, maintainable, and human-readable code. Apply these rules when writing or reviewing code to ensure consistency and quality.
globs: 
---
# Clean Code Guidelines

## Constants Over Magic Numbers
- Replace hard-coded values with named constants
- Use descriptive constant names that explain the value's purpose
- Keep constants at the top of the file or in a dedicated constants file

## Meaningful Names
- Variables, functions, and classes should reveal their purpose
- Names should explain why something exists and how it's used
- Avoid abbreviations unless they're universally understood

## Smart Comments
- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects

## Single Responsibility
- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split

## DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions
- Share common logic through proper abstraction
- Maintain single sources of truth

## Clean Structure
- Keep related code together
- Organize code in a logical hierarchy
- Use consistent file and folder naming conventions

## Encapsulation
- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions

## Code Quality Maintenance
- Refactor continuously
- Fix technical debt early
- Leave code cleaner than you found it

## Testing
- Write tests before fixing bugs
- Keep tests readable and maintainable
- Test edge cases and error conditions

## Version Control
- Write clear commit messages
- Make small, focused commits
- Use meaningful branch names
````

## File: .cursor/rules/codequality.mdc
````
---
description: Code Quality Guidelines
globs: 
---
# Code Quality Guidelines

## Verify Information
Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.

## File-by-File Changes
Make changes file by file and give me a chance to spot mistakes.

## No Apologies
Never use apologies.

## No Understanding Feedback
Avoid giving feedback about understanding in comments or documentation.

## No Whitespace Suggestions
Don't suggest whitespace changes.

## No Summaries
Don't summarize changes made.

## No Inventions
Don't invent changes other than what's explicitly requested.

## No Unnecessary Confirmations
Don't ask for confirmation of information already provided in the context.

## Preserve Existing Code
Don't remove unrelated code or functionalities. Pay attention to preserving existing structures.

## Single Chunk Edits
Provide all edits in a single chunk instead of multiple-step instructions or explanations for the same file.

## No Implementation Checks
Don't ask the user to verify implementations that are visible in the provided context.

## No Unnecessary Updates
Don't suggest updates or changes to files when there are no actual modifications needed.

## Provide Real File Links
Always provide links to the real files, not x.md.

## No Current Implementation
Don't show or discuss the current implementation unless specifically requested.
````

## File: .cursor/rules/nextjs.mdc
````
---
description: Next.js with TypeScript and Tailwind UI best practices
globs: apps/web/*.ts,apps/web/**/*.tsx
alwaysApply: false
---

# Next.js Best Practices

## Project Structure
- Use the App Router directory structure
- Place components in `app` directory for route-specific components
- Place shared components in `components` directory
- Place utilities and helpers in `lib` directory
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)
- Use camel case for files (e.g., `useMultiplayerSocket.ts`)

## Components
- Use Server Components by default
- Mark client components explicitly with 'use client'
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Implement proper error boundaries
- Place static content and interfaces at file end

## Performance
- Optimize images: Use WebP format, size data, lazy loading
- Minimize use of 'useEffect' and 'setState'
- Favor Server Components (RSC) where possible
- Use dynamic loading for non-critical components
- Implement proper caching strategies

## Data Fetching
- Use Server Components for data fetching when possible
- Implement proper error handling for data fetching
- Use appropriate caching strategies
- Handle loading and error states appropriately

## Routing
- Use the App Router conventions
- Implement proper loading and error states for routes
- Use dynamic routes appropriately
- Handle parallel routes when needed

## Forms and Validation
- Use Zod for form validation
- Implement proper server-side validation
- Handle form errors appropriately
- Show loading states during form submission

## State Management
- Minimize client-side state
- Use React Context sparingly
- Prefer server state when possible
- Implement proper loading states
````

## File: .cursor/rules/tailwind.mdc
````
---
description: Tailwind CSS and UI component best practices for modern web applications
globs: **/*.css,apps/web/**/*.tsx,apps/web/tailwind.config.ts
alwaysApply: false
---

# Tailwind CSS Best Practices

## Project Setup
- Use proper Tailwind configuration
- Configure theme extension properly
- Set up proper purge configuration
- Use proper plugin integration
- Configure custom spacing and breakpoints
- Set up proper color palette

## Component Styling
- Use utility classes over custom CSS
- Group related utilities with @apply when needed
- Use proper responsive design utilities
- Implement dark mode properly
- Use proper state variants
- Keep component styles consistent

## Layout
- Use Flexbox and Grid utilities effectively
- Implement proper spacing system
- Use container queries when needed
- Implement proper responsive breakpoints
- Use proper padding and margin utilities
- Implement proper alignment utilities

## Typography
- Use proper font size utilities
- Implement proper line height
- Use proper font weight utilities
- Configure custom fonts properly
- Use proper text alignment
- Implement proper text decoration

## Colors
- Use semantic color naming
- Implement proper color contrast
- Use opacity utilities effectively
- Configure custom colors properly
- Use proper gradient utilities
- Implement proper hover states

## Components
- Use shadcn/ui components when available
- Extend components properly
- Keep component variants consistent
- Implement proper animations
- Use proper transition utilities
- Keep accessibility in mind

## Responsive Design
- Use mobile-first approach
- Implement proper breakpoints
- Use container queries effectively
- Handle different screen sizes properly
- Implement proper responsive typography
- Use proper responsive spacing

## Performance
- Use proper purge configuration
- Minimize custom CSS
- Use proper caching strategies
- Implement proper code splitting
- Optimize for production
- Monitor bundle size

## Best Practices
- Follow naming conventions
- Keep styles organized
- Use proper documentation
- Implement proper testing
- Follow accessibility guidelines
- Use proper version control
````

## File: .cursor/rules/typescript.mdc
````
---
description: TypeScript coding standards and best practices for modern web development
globs: **/*.ts, **/*.tsx, **/*.d.ts
---

# TypeScript Best Practices

## Type System
- Prefer interfaces over types for object definitions
- Use type for unions, intersections, and mapped types
- Avoid using `any`, prefer `unknown` for unknown types
- Use strict TypeScript configuration
- Leverage TypeScript's built-in utility types
- Use generics for reusable type patterns

## Naming Conventions
- Use PascalCase for type names and interfaces
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Use descriptive names with auxiliary verbs (e.g., isLoading, hasError)
- Prefix interfaces for React props with 'Props' (e.g., ButtonProps)

## Code Organization
- Keep type definitions close to where they're used
- Export types and interfaces from dedicated type files when shared
- Use barrel exports (index.ts) for organizing exports
- Place shared types in a `types` directory
- Co-locate component props with their components

## Functions
- Use explicit return types for public functions
- Use arrow functions for callbacks and methods
- Implement proper error handling with custom error types
- Use function overloads for complex type scenarios
- Prefer async/await over Promises

## Best Practices
- Enable strict mode in tsconfig.json
- Use readonly for immutable properties
- Leverage discriminated unions for type safety
- Use type guards for runtime type checking
- Implement proper null checking
- Avoid type assertions unless necessary

## Error Handling
- Create custom error types for domain-specific errors
- Use Result types for operations that can fail
- Implement proper error boundaries
- Use try-catch blocks with typed catch clauses
- Handle Promise rejections properly

## Patterns
- Use the Builder pattern for complex object creation
- Implement the Repository pattern for data access
- Use the Factory pattern for object creation
- Leverage dependency injection
- Use the Module pattern for encapsulation
````

## File: apps/api/src/database/database.module.ts
````typescript
import { NBAPrismaService } from '@/database/nba.prisma.service';
import { UsersPrismaService } from '@/database/users.prisma.service';
import { Global, Module } from '@nestjs/common';

@Module({
  providers: [UsersPrismaService, NBAPrismaService],
  exports: [UsersPrismaService, NBAPrismaService],
})
@Global()
export class DatabaseModule {}
````

## File: apps/api/src/nba/games/careerpath/careerpath.module.ts
````typescript
import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PlayersModule } from 'src/nba/player/player.module';

@Module({
  imports: [PlayersModule, UsersModule, DatabaseModule],
  providers: [CareerPathGateway],
})
export class CareerPathModule {}
````

## File: apps/api/src/nba/games/careerpath/game.service.ts
````typescript
import { PlayersService } from '@/nba/player/player.service';
import { BaseGameService, GameDifficulty, RoundProps } from '@dribblio/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService implements BaseGameService {
  constructor(private playerService: PlayersService) {}

  async generateRound(difficulty: GameDifficulty): Promise<RoundProps> {
    const player = await this.playerService.findRandom(difficulty.filter);

    if (!player) {
      throw new Error('No player found');
    }

    const validAnswers = await this.playerService.findAll({
      where: { team_history: { equals: player.team_history } },
    });

    const players = await this.playerService.findAll({
      orderBy: {
        last_name: 'desc',
      },
    });

    return { validAnswers, players };
  }
}
````

## File: apps/api/src/nba/player/player.module.ts
````typescript
import { PlayersController } from '@/nba/player/player.controller';
import { PlayersService } from '@/nba/player/player.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
````

## File: apps/api/src/nba/player/player.service.ts
````typescript
import { NBAPrismaService } from '@/database/nba.prisma.service';
import { runtime } from '@dribblio/database';
import { Prisma as NBAPrisma, Player } from '@dribblio/database/generated/prisma-nba';
import { Injectable } from '@nestjs/common';

import $Extensions = runtime.Types.Extensions;

@Injectable()
export class PlayersService {
  constructor(private nba: NBAPrismaService) {}

  async findAll<
    T extends NBAPrisma.PlayerFindManyArgs,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  >(args?: NBAPrisma.SelectSubset<T, NBAPrisma.PlayerFindManyArgs<ExtArgs>>) {
    return await this.nba.player.findMany(args);
  }

  async findOne(id: number): Promise<Player | null> {
    return await this.nba.player.findFirst({ where: { id: { equals: id } } });
  }

  async findRandom(where?: NBAPrisma.PlayerWhereInput): Promise<Player | null> {
    const playerIds = (await this.findAll({ where: where, select: { id: true } })).map(
      (player) => player.id,
    );
    const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
    return await this.findOne(randomId);
  }

  async findCount(): Promise<number> {
    return await this.nba.player.count();
  }
}
````

## File: apps/api/src/users/users.controller.ts
````typescript
import { SignedUrlInterceptor } from '@/users/signedurl.inteceptor';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@dribblio/types';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SignedUrlInterceptor)
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@Request() req) {
    return await this.usersService.get(req.user.id);
  }

  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return await this.usersService.uploadProfileImage(req.user.id, file);
  }
}
````

## File: apps/api/README.md
````markdown
# Dribbl.io API

A NestJS-based API service for Dribbl.io, providing NBA player data, real-time game functionality, and user authentication.

## Architecture

The API is built using NestJS and follows a modular architecture:

- `NBAModule`: Core module handling NBA-related features
  - `PlayersModule`: Manages NBA player data and statistics
  - `GamesModule`: Handles game-related functionality
    - `CareerPath`: Real-time game implementation using WebSockets
- `AuthModule`: Authentication and authorization using Auth0
  - `JwtStrategy`: JWT token validation and user authentication
- `UsersModule`: User management and profile functionality
  - `UsersController`: User profile endpoints
  - `UsersService`: User data management
  - `AvatarService`: Avatar upload and signed URL generation
  - `S3Service`: AWS S3 file upload functionality
  - `SignedUrlInterceptor`: Automatic signed URL generation for user profiles
- `DatabaseModule`: Database integration using Prisma with PostgreSQL
  - NBA database for player data
  - Users database for authentication and user profiles

## Tech Stack

- NestJS 11.x
- Socket.IO for real-time communication
- Prisma for database operations
- PostgreSQL database
- TypeScript
- Jest for testing
- **Auth0 for authentication and authorization**
- **Passport.js for JWT strategy**
- **JWKS-RSA for token validation**
- **AWS SDK for S3 and CloudFront integration**
- **AWS Secrets Manager for secure key storage**

## Database Schema

The API uses PostgreSQL databases with the following main models:

### NBA Database

#### Player Model

```prisma
model Player {
  id                 Int               @id
  first_name         String?
  last_name          String?
  display_first_last String?
  display_fi_last    String?
  birthdate          DateTime?
  school             String?
  country            String?
  height             String?
  weight             String?
  season_exp         Int?
  jersey             String?
  position           String?
  team_history       String?
  is_active          Boolean?
  from_year          Int?
  to_year            Int?
  total_games_played Int?
  draft_round        String?
  draft_number       String?
  draft_year         String?
  player_accolades   player_accolades?
}
```

#### Player Accolades Model

```prisma
model player_accolades {
  player_id Int    @id
  accolades Json?
  player    Player @relation(fields: [player_id], references: [id])
}
```

### Users Database

#### User Model

```prisma
model User {
  id String @id
  display_name String?
  name String?
  profile_url String?
}
```

## Authentication

The API implements secure authentication using Auth0:

### JWT Strategy

- **Token Validation**: Validates JWT tokens using Auth0's JWKS endpoint
- **User Creation**: Automatically creates user profiles on first authentication
- **Profile Sync**: Fetches user profile information from Auth0
- **Protected Routes**: Uses `@UseGuards(AuthGuard('jwt'))` decorator

### Environment Variables

Required Auth0 configuration:

```bash
AUTH0_DOMAIN="your-domain.auth0.com"
AUTH0_AUDIENCE="your-api-identifier"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_SECRET="your-secret"
AUTH0_SCOPE="openid profile email"
```

## Avatar Management

The API provides comprehensive avatar management functionality:

### AWS S3 Integration

- **Secure File Upload**: Upload avatar images to S3 with proper file validation
- **Automatic File Naming**: Unique file names based on user ID and timestamp
- **CloudFront Distribution**: Serve avatars through CloudFront for better performance
- **Signed URLs**: Generate time-limited signed URLs for secure avatar access

### Avatar Service Features

- **Image Upload**: Handle multipart form data for avatar uploads
- **File Validation**: Validate file types and sizes
- **Secure Storage**: Store avatars in S3 with proper access controls
- **Signed URL Generation**: Create time-limited signed URLs for secure access
- **Automatic URL Signing**: Interceptor automatically signs profile URLs in responses

### Required AWS Environment Variables

```bash
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
AWS_CLOUDFRONT_CNAME="your-cloudfront-domain.cloudfront.net"
AWS_CLOUDFRONT_KEY_PAIR_ID="your-cloudfront-key-pair-id"
AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME="your-secrets-manager-secret-name"
```

## API Endpoints

### Players API

Base URL: `/players`

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/`                        | Get all players        |
| GET    | `/random`                  | Get a random player    |
| GET    | `/count`                   | Get total player count |
| GET    | `/search?searchTerm=:term` | Search players by name |
| GET    | `/:id`                     | Get player by ID       |

### Users API

Base URL: `/me` (Protected routes requiring authentication)

| Method | Endpoint  | Description                 |
| ------ | --------- | --------------------------- |
| GET    | `/`       | Get current user profile    |
| PATCH  | `/`       | Update current user profile |
| PUT    | `/avatar` | Upload user avatar image    |

## CareerPath Game

The CareerPath game is a real-time multiplayer/singleplayer game where players must identify NBA players based on their team history.

### Game Modes

1. **Single Player**

   - Players try to achieve the highest score possible
   - Limited number of lives
   - Progressive difficulty

2. **Multiplayer**
   - Real-time competition in game rooms
   - All players see the same team history
   - First correct answer gets a point
   - Real-time score updates

### Game Difficulties

1. **First Team All-NBA Players**

   - Only players who made All-NBA First Team
   - Players from 1980 onwards
   - Multiple team history required

2. **All-NBA Players**

   - Players who made any All-NBA team
   - Players from 1980 onwards
   - Multiple team history required

3. **Current Players**

   - Only active NBA players
   - Easier difficulty level

4. **All Players**
   - Complete NBA player database
   - Most challenging difficulty

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   # Database URLs
   DATABASE_URL="postgresql://user:password@localhost:5432/dribblio"
   USERS_DATABASE_URL="postgresql://user:password@localhost:5432/dribblio_users"

   # Auth0 Configuration
   AUTH0_DOMAIN="your-domain.auth0.com"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_SECRET="your-secret"
   AUTH0_SCOPE="openid profile email"

   # AWS Configuration
   AWS_S3_BUCKET_NAME="your-s3-bucket-name"
   AWS_CLOUDFRONT_CNAME="your-cloudfront-domain.cloudfront.net"
   AWS_CLOUDFRONT_KEY_PAIR_ID="your-cloudfront-key-pair-id"
   AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME="your-secrets-manager-secret-name"

   # Server Configuration
   PORT=3002
   ```

3. Set up AWS services:

   - Create an S3 bucket for avatar storage
   - Set up CloudFront distribution for secure avatar access
   - Create a CloudFront key pair for signed URLs
   - Store the private key in AWS Secrets Manager
   - Configure CORS on your S3 bucket

4. Set up databases:

   ```bash
   # Generate Prisma clients
   npm run db:generate

   # Run database migrations
   npm run db:migrate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Run tests:
   ```bash
   npm test
   ```

## Available Scripts

- `npm run build`: Build the application
- `npm run dev`: Start development server with hot reload
- `npm run start:prod`: Start production server
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run test:cov`: Generate test coverage report
- `npm run db:generate`: Generate Prisma clients
- `npm run db:migrate`: Run database migrations

## WebSocket Events

The CareerPath game uses WebSocket connections for real-time gameplay. The following events are supported:

- `join_room`: Join a game room
- `leave_room`: Leave a game room
- `start_game`: Start a new game
- `submit_answer`: Submit a player guess
- `game_state`: Receive game state updates
- `score_update`: Receive score updates

## Dependencies

### Core Dependencies

- `@nestjs/common`: NestJS core framework
- `@nestjs/core`: NestJS core functionality
- `@nestjs/platform-express`: Express platform integration
- `@nestjs/platform-socket.io`: Socket.IO platform integration
- `@nestjs/websockets`: WebSocket support
- `@nestjs/passport`: Passport integration
- `passport-jwt`: JWT strategy for Passport
- `jwks-rsa`: JWKS RSA key retrieval

### AWS Dependencies

- `@aws-sdk/client-s3`: S3 client for file uploads
- `@aws-sdk/client-secrets-manager`: Secrets Manager client
- `@aws-sdk/cloudfront-signer`: CloudFront signed URL generation
- `@aws-sdk/lib-storage`: S3 upload utilities

### Database & Validation

- `@dribblio/database`: Shared database package
- `class-validator`: Request validation
- `class-transformer`: Object transformation
- `rxjs`: Reactive programming utilities

## Security Features

- **JWT Token Validation**: Secure token-based authentication
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Secure error responses without sensitive information
- **Signed URLs**: Time-limited secure access to avatar images
- **AWS IAM**: Proper access controls for S3 and CloudFront

## Future Enhancements

- **Enhanced User Profiles**: Additional user statistics and preferences
- **Leaderboards**: Global and friend-based leaderboards
- **Achievement System**: Gamification with achievements and badges
- **Social Features**: Friend system and social interactions
- **Advanced Analytics**: Detailed game statistics and insights
- **Cloud Deployment**: Production-ready deployment configuration
- **Image Processing**: Server-side image optimization and resizing
- **CDN Integration**: Enhanced content delivery network setup

## License

Copyright (c) 2025 Cameron Slash. All Rights Reserved.

This software and associated documentation files (the "Software") are the proprietary property of Cameron Slash and are protected by copyright law. The Software is licensed, not sold.

You are not permitted to:

- Copy, modify, or create derivative works of the Software
- Reverse engineer, decompile, or disassemble the Software
- Remove or alter any proprietary notices or labels on the Software
- Use the Software for any commercial purpose
- Distribute, sublicense, or transfer the Software to any third party

Any unauthorized use, reproduction, or distribution of the Software is strictly prohibited and may result in severe legal consequences.
````

## File: apps/web/src/app/singleplayer/page.tsx
````typescript
'use client';

import { CorrectAnswer } from '@/components/careerpath/answer';
import { CareerPath } from '@/components/careerpath/careerpathview';
import SinglePlayerConfigModal from '@/components/config/singleplayer/configmodal';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Button } from '@/components/ui/button';
import useConfetti from '@/hooks/useConfetti';
import useSinglePlayerSocket from '@/hooks/useSinglePlayerSocket';
import { nba } from '@dribblio/database';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';

export default function SinglePlayer() {
  const { theme } = useTheme();
  const { onConfetti } = useConfetti();

  const correctAction = (validAnswers: nba.Player[]) => {
    toast(<CorrectAnswer validAnswers={validAnswers} />, { theme });
    onConfetti();
  };

  const incorrectAction = () => {
    toast.error('Incorrect', { theme });
  };

  const {
    isConnected,
    canStartGame,
    isRoomConfigured,
    onConfigureRoom,
    onStartGame,
    machineState,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  } = useSinglePlayerSocket({ correctAction, incorrectAction });

  return (
    <div className="flex flex-col h-full space-y-8">
      <SinglePlayerConfigModal isOpen={!isRoomConfigured} onConfigureRoom={onConfigureRoom} />
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        <p>State: {machineState}</p>
      </div>

      {isConnected && (
        <div className="w-full flex flex-col items-center space-y-8">
          {canStartGame && <Button onClick={onStartGame}>Start Game</Button>}
          {teams && (
            <div className="w-full flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center">
                <p className="font-black text-2xl">Lives: {lives}</p>
                <p className="font-black text-2xl">Score: {score}</p>
              </div>
              <CareerPath teams={teams} />
              <PlayerSearchBar className="w-1/2" onSelect={onGuess} />
              <Button onClick={onSkip}>Skip</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
````

## File: apps/web/src/components/search/playersearchbar.tsx
````typescript
import PlayerSearchResult from '@/components/search/playersearchresult';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { nba } from '@dribblio/database';
import { useEffect, useState } from 'react';

export default function PlayerSearchBar({
  className,
  playerList,
  onSelect,
}: Readonly<{
  className?: string;
  playerList?: nba.Player[];
  onSelect?: (id: number) => void;
}>) {
  const [search, setSearch] = useState<string>('');
  const [players, setPlayers] = useState<nba.Player[]>([]);

  useEffect(() => {
    if (!playerList) {
      fetch('/api/players')
        .then((res) => res.json())
        .then((list: nba.Player[]) =>
          setPlayers(list.sort((a, b) => a.last_name!.localeCompare(b.last_name!))),
        );
    } else {
      setPlayers(playerList);
    }
  }, [playerList]);

  return (
    <div className={`flex justify-center ${className}`}>
      <Command
        className="rounded-lg border shadow-md md:min-w-[450px]"
        filter={(value, search) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          return 0;
        }}
      >
        <CommandInput
          placeholder={`Search ${players?.length} players...`}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No player found</CommandEmpty>
          {players?.map((player) => (
            <CommandItem
              key={player.id}
              onSelect={() => {
                if (onSelect) {
                  onSelect(player.id);
                }
                setSearch('');
              }}
            >
              <PlayerSearchResult player={player} />
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
````

## File: apps/web/src/config/site.ts
````typescript
import { Gamepad2, House, LucideProps, Swords } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type SiteConfig = typeof siteConfig;

type NavItem = {
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  href: string;
};

export const siteConfig: { name: string; navItems: NavItem[] } = {
  name: 'NBA Career Game',
  navItems: [
    {
      label: 'Home',
      icon: House,
      href: '/',
    },
    {
      label: 'Single Player',
      icon: Gamepad2,
      href: '/singleplayer',
    },
    {
      label: 'Multiplayer',
      icon: Swords,
      href: '/multiplayer',
    },
  ],
};
````

## File: apps/web/src/hooks/usePlayerSearch.ts
````typescript
'use client';

import { nba } from '@dribblio/database';
import { SearchResponse } from '@dribblio/types';
import { AsyncListLoadOptions, useAsyncList } from '@react-stately/data';
import { useEffect, useState } from 'react';

const usePlayerSearch = () => {
  const [playerCount, setPlayerCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/players/count')
      .then((res) => res.json())
      .then(setPlayerCount);
  }, [setPlayerCount]);

  const list = useAsyncList<nba.Player>({
    async load({ signal, filterText }: AsyncListLoadOptions<nba.Player, string>) {
      const res = await fetch(`/api/players/search?searchTerm=${filterText}`, {
        signal,
      });
      const json: SearchResponse = await res.json();

      return {
        items: json.results,
      };
    },
  });

  return { playerCount, list };
};

export default usePlayerSearch;
````

## File: apps/web/src/lib/schemas.ts
````typescript
import {
  GameDifficultyNames,
  HostFormValues,
  JoinFormValues,
  UpdateUserDto,
} from '@dribblio/types';
import Joi from 'joi';

export const hostSchema = Joi.object<HostFormValues>({
  isRoundLimit: Joi.boolean().required(),
  config: Joi.object({
    scoreLimit: Joi.number().optional(),
    roundLimit: Joi.number().optional(),
    roundTimeLimit: Joi.number().required(),
    gameDifficulty: Joi.string()
      .valid(...GameDifficultyNames)
      .required(),
  }),
}).custom((value, helpers) => {
  const { isRoundLimit, config } = value;
  if (isRoundLimit && !config.roundLimit) {
    return helpers.error('any.custom', {
      message: 'Round Limit is required when Round Limit mode is selected',
    });
  }
  if (!isRoundLimit && !config.scoreLimit) {
    return helpers.error('any.custom', {
      message: 'Score Limit is required when Score Limit mode is selected',
    });
  }
  return value;
}, 'Round/Score limit conditional check');

export const joinSchema = Joi.object<JoinFormValues>({
  roomId: Joi.string().required(),
});

export const updateUserSchema = Joi.object<UpdateUserDto>({
  display_name: Joi.string().optional(),
  name: Joi.string().optional(),
});
````

## File: apps/web/next.config.mjs
````
/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3002/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `http://localhost:3002/socket.io/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
````

## File: apps/web/README.md
````markdown
# Dribbl.io Web Application

A Next.js-based web application for Dribbl.io, providing an interactive interface for the CareerPath NBA player guessing game with secure user authentication.

## Architecture

The web application is built using Next.js 15 and follows a modern React architecture:

- **App Router**: Next.js App Router for routing and page organization
  - `/singleplayer`: Single player game mode
  - `/multiplayer`: Multiplayer game mode
  - `/profile`: User profile management (protected route)
  - `/auth/login`: Authentication login page
  - `/auth/logout`: Authentication logout page
- **Component Structure**:
  - `components/`: Reusable UI components
  - `hooks/`: Custom React hooks
  - `lib/`: Utility functions and shared logic
  - `styles/`: Global styles and Tailwind configuration
  - `config/`: Application configuration
  - `icons/`: SVG icons and assets
- **Authentication Integration**:
  - Auth0 Next.js SDK for authentication
  - Protected routes with middleware
  - User profile management
  - JWT token handling
- **Avatar Management**:
  - Drag-and-drop file uploads
  - Image cropping and editing
  - Real-time preview
  - Secure upload to S3

## Tech Stack

- Next.js 15.x with App Router
- React 19.x
- TypeScript
- Tailwind CSS for styling
- Radix UI for accessible components
- Socket.IO Client for real-time communication
- Zod for schema validation
- React Hook Form for form handling
- **Auth0 Next.js SDK for authentication**
- **Next.js Middleware for route protection**
- **React Image Crop for avatar editing**
- **React Dropzone for file uploads**

## Features

### Game Modes

1. **Single Player**

   - Progressive difficulty levels
   - Score tracking (+1 point per correct answer)
   - Lives system (-1 life per incorrect answer)
   - Game ends when all lives are lost
   - Option to restart with a new game
   - Player statistics

2. **Multiplayer**
   - Room-based gameplay
     - Host creates a room and receives a room code
     - Players join using the room code
     - Players can leave by navigating away
   - Real-time gameplay
     - All players see the same team history
     - Round ends when:
       - A player correctly guesses the player
       - Round time limit is reached
     - After each round:
       - All acceptable answers are shown
       - New round automatically starts
   - Live score updates
   - Competitive gameplay

### Authentication & User Management

- **Auth0 Integration**: Secure authentication with social login support
- **User Profiles**: Personalized user experience with profile management
- **Protected Routes**: Secure access to user-specific features
- **Profile Management**: View and update user profile information
- **Session Management**: Automatic session handling and token refresh
- **Social Login**: Support for Google and other social providers

### Avatar Management

- **Drag-and-Drop Upload**: Intuitive file upload interface
- **Image Cropping**: Interactive crop tool with aspect ratio lock
- **Real-time Preview**: Live preview of cropped image
- **File Validation**: Support for JPG, PNG, GIF, WebP (max 5MB)
- **Secure Upload**: Direct upload to S3 with signed URLs
- **Profile Integration**: Seamless integration with user profiles

### UI Components

The application uses a combination of:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Responsive design for all screen sizes
- **Auth0 components for authentication flows**
- **Custom avatar editor with image cropping**

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (create `.env.local` file):

   ```bash
   # Auth0 Configuration
   AUTH0_SECRET="your-secret"
   AUTH0_BASE_URL="http://localhost:3000"
   AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_SCOPE="openid profile email"
   ```

3. Configure Auth0 Application:

   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Regular Web Application)
   - Configure callback URLs: `http://localhost:3000/api/auth/callback`
   - Configure logout URLs: `http://localhost:3000`
   - Create an API with appropriate scopes
   - Update the environment variables with your Auth0 configuration

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Start production server:
   ```bash
   npm run start
   ```

## Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build the application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run check-types`: Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── singleplayer/    # Single player game mode
│   ├── multiplayer/     # Multiplayer game mode
│   ├── profile/         # User profile management (protected)
│   ├── auth/            # Authentication routes
│   │   ├── login/       # Login page
│   │   └── logout/      # Logout page
│   ├── api/             # API routes
│   │   └── auth/        # Auth0 API routes
│   ├── layout.tsx       # Root layout
│   └── providers.tsx    # Global providers
├── components/          # Reusable UI components
│   ├── navbar/          # Navigation components
│   ├── ui/              # Base UI components
│   ├── avatar-editor.tsx # Avatar editing component
│   ├── editprofilemodal.tsx # Profile editing modal
│   └── login-form.tsx   # Authentication form
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   └── auth0.ts        # Auth0 configuration
├── icons/              # SVG icons
├── config/             # App configuration
├── styles/             # Global styles
└── middleware.ts       # Next.js middleware for route protection
```

## Dependencies

### Core

- Next.js 15.x
- React 19.x
- TypeScript
- Tailwind CSS

### Authentication

- **@auth0/nextjs-auth0**: Auth0 Next.js SDK
- **Next.js Middleware**: Route protection

### UI Components

- Radix UI primitives
- Lucide React icons
- Tailwind Variants

### Avatar Management

- **react-image-crop**: Image cropping functionality
- **react-dropzone**: Drag-and-drop file uploads
- **@radix-ui/react-avatar**: Avatar display components

### State Management & Data

- React Hook Form
- Zod for validation
- Socket.IO Client
- Canvas Confetti for effects

### Development

- ESLint
- TypeScript
- PostCSS
- Tailwind CSS

## Authentication Flow

1. **Login**: Users can log in via Auth0's universal login or social providers
2. **Session Management**: Automatic session handling with token refresh
3. **Protected Routes**: Middleware protects routes requiring authentication
4. **Profile Access**: Authenticated users can access their profile page
5. **API Integration**: JWT tokens are used for secure API communication
6. **Logout**: Secure logout with session cleanup

## Avatar Upload Flow

1. **File Selection**: Users can drag and drop or click to select an image
2. **File Validation**: System validates file type and size (max 5MB)
3. **Image Cropping**: Interactive crop tool with 1:1 aspect ratio
4. **Preview**: Real-time preview of the cropped image
5. **Upload**: Secure upload to S3 via API
6. **Profile Update**: Avatar URL is automatically updated in user profile

## Security Features

- **JWT Token Validation**: Secure token-based authentication
- **Route Protection**: Middleware-based route protection
- **Session Management**: Secure session handling
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Secure error responses
- **File Upload Security**: Secure file upload with validation

## Future Enhancements

- **Enhanced User Profiles**: Additional user statistics and preferences
- **Leaderboards**: Global and friend-based leaderboards
- **Achievement System**: Gamification with achievements and badges
- **Social Features**: Friend system and social interactions
- **Advanced Analytics**: Detailed game statistics and insights
- **Progressive Web App**: Offline support and app-like experience
- **Theme Customization**: User-selectable themes and customization
- **Image Optimization**: Client-side image compression and optimization
- **Avatar Templates**: Pre-designed avatar templates and customization options

## License

Copyright (c) 2025 Cameron Slash. All Rights Reserved.

This software and associated documentation files (the "Software") are the proprietary property of Cameron Slash and are protected by copyright law. The Software is licensed, not sold.

You are not permitted to:

- Copy, modify, or create derivative works of the Software
- Reverse engineer, decompile, or disassemble the Software
- Remove or alter any proprietary notices or labels on the Software
- Use the Software for any commercial purpose
- Distribute, sublicense, or transfer the Software to any third party

Any unauthorized use, reproduction, or distribution of the Software is strictly prohibited and may result in severe legal consequences.
````

## File: apps/web/tsconfig.json
````json
{
  "extends": "@dribblio/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts", "next.config.mjs", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "public"]
}
````

## File: packages/eslint-config/base.js
````javascript
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import turboPlugin from 'eslint-plugin-turbo';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const baseConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      tseslint,
      jest,
      turbo: turboPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals,
      },
      parser: tseslint.parser,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['#', '.src']],
        },
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**'],
  },
];
````

## File: packages/eslint-config/next.js
````javascript
import js from '@eslint/js';
import { default as pluginNext } from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
    },
  },
];
````

## File: packages/types/tsconfig.json
````json
{
  "extends": "@dribblio/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
````

## File: apps/api/src/nba/games/careerpath/room/room.service.ts
````typescript
import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { UsersService } from '@/users/users.service';
import { users } from '@dribblio/database';
import {
  HostRoomMessageBody,
  JoinRoomMessageBody,
  MultiplayerConfig,
  Room,
  SinglePlayerConfig,
} from '@dribblio/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';
import { Socket } from 'socket.io';

const uid = new ShortUniqueId({ length: 5, dictionary: 'alpha_upper' });

@Injectable()
export class RoomService {
  private rooms: Record<string, Room> = {};

  constructor(
    @Inject(forwardRef(() => CareerPathGateway))
    private gateway: CareerPathGateway,
    private roomFactory: RoomFactory,
    private usersService: UsersService,
  ) {}

  async createRoom(
    socket: Socket,
    { isMulti, userId, config }: HostRoomMessageBody,
  ): Promise<Room> {
    const roomId: string = this.generateUniqueCode();

    if (!this.rooms[roomId]) {
      this.rooms[roomId] = isMulti
        ? this.roomFactory.createMultiplayerRoom(socket, roomId, config as MultiplayerConfig)
        : this.roomFactory.createSinglePlayerRoom(socket, config as SinglePlayerConfig);
    }

    console.log(`Game machine created for room ${roomId}`);

    await this.joinRoom(socket, { roomId, userId });

    return this.rooms[roomId];
  }

  destroyRoom(id: string) {
    delete this.rooms[id];
    console.log(`Room destroyed for room ${id}`);
  }

  async joinRoom(socket: Socket, { roomId, userId }: JoinRoomMessageBody): Promise<void> {
    if (!this.rooms[roomId]) return;

    socket.join(roomId);

    this.roomFactory.setUpListenersOnJoin(socket, this.rooms[roomId]);

    if (this.rooms[roomId].isMulti) {
      const user = await this.usersService.get(userId);

      if (!user) throw new Error('User not found');

      this.rooms[roomId] = {
        ...this.rooms[roomId],
        users: [...this.rooms[roomId].users, user],
      };
    } else {
      this.rooms[roomId] = {
        ...this.rooms[roomId],
        users: [
          ...this.rooms[roomId].users,
          { id: socket.id, name: 'Guest', display_name: 'Guest', profile_url: '' },
        ],
      };
    }

    const { ...room } = this.rooms[roomId];

    this.gateway.server.to(roomId).emit('room_updated', room);
  }

  leaveRoom(roomId: string, userId: string): void {
    let room: Room = this.rooms[roomId];

    if (room) {
      room = {
        ...room,
        users: [...room.users.filter((user: users.User) => user.id !== userId)],
      };

      if (!room.users.some((user: users.User) => user)) {
        this.destroyRoom(roomId);
      } else {
        this.gateway.server.to(roomId).emit('room_updated', room);
      }
    }
  }

  generateUniqueCode(): string {
    const roomId = uid.randomUUID();
    if (roomId in this.rooms) {
      return this.generateUniqueCode();
    }

    return roomId;
  }
}
````

## File: apps/api/src/nba/games/careerpath/careerpath.gateway.ts
````typescript
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { HostRoomMessageBody, JoinRoomMessageBody } from '@dribblio/types';
import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CareerPathGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  handleDisconnect(client: Socket) {
    this.roomService.leaveRoom(Array.from(client.rooms)[1], client.id);
  }

  @SubscribeMessage('host_room')
  async handleHostRoom(
    @MessageBody() config: HostRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.createRoom(client, config);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() config: JoinRoomMessageBody,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.joinRoom(client, config);
  }
}
````

## File: apps/api/src/nba/nba.module.ts
````typescript
import { DatabaseModule } from '@/database/database.module';
import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { GameService } from '@/nba/games/careerpath/game.service';
import { RoomFactory } from '@/nba/games/careerpath/room/factory.service';
import { RoomService } from '@/nba/games/careerpath/room/room.service';
import { PlayersModule } from '@/nba/player/player.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlayersModule, DatabaseModule, UsersModule],
  controllers: [],
  providers: [CareerPathGateway, RoomService, RoomFactory, GameService],
})
export class NBAModule {}
````

## File: apps/api/src/users/users.module.ts
````typescript
import { AvatarService } from '@/users/avatar.service';
import { S3Service } from '@/users/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    S3Service,
    AvatarService,
    {
      provide: S3Client,
      useValue: new S3Client(),
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
````

## File: apps/web/src/app/multiplayer/page.tsx
````typescript
'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import JoinHostModal from '@/components/config/multiplayer/joinhostmodal';
import PlayerSearchBar from '@/components/search/playersearchbar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useMultiplayerSocket from '@/hooks/useMultiplayerSocket';
import { UserGameInfo } from '@dribblio/types';
import { User } from 'lucide-react';

export default function Game() {
  const {
    isConnected,
    roomId,
    roundActive,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
    onGuess,
    timeLeft,
    validAnswers,
  } = useMultiplayerSocket();

  return (
    <div className="flex flex-col h-full space-y-8">
      <JoinHostModal isOpen={!roomId} onJoinRoom={onJoinRoom} onHostRoom={onHostRoom} />
      <div className="justify-start">
        <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
        {roomId && <p>{`Room Code: ${roomId}`}</p>}
        {users.some((user: UserGameInfo) => user) && (
          <div>
            <p>Users:</p>
            <ul>
              {users.map((user: UserGameInfo) => (
                <li key={user.info.id}>
                  <div className="flex flex-row space-x-2 items-center">
                    {user.info.profile_url ? (
                      <Avatar>
                        <AvatarImage
                          src={user.info.profile_url}
                          alt={user.info.name ?? ''}
                          width={24}
                          height={24}
                        />
                      </Avatar>
                    ) : (
                      <User />
                    )}
                    <p>{user.info.name}</p>
                    <p>{user.score}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {canStartGame && (
        <div>
          <Button onClick={onStartGame}>Start Game</Button>
        </div>
      )}

      {roundActive && (
        <div className="w-full flex flex-col items-center space-y-8">
          <p className="text-2xl font-bold">Time Left: {timeLeft}</p>
          <CareerPath teams={teams!} />
          <PlayerSearchBar playerList={players} onSelect={onGuess} />
        </div>
      )}

      {!roundActive && !canStartGame && (
        <div>
          <p>Correct Answers:</p>
          <ul>
            {validAnswers.map((answer) => (
              <li key={answer.id}>{answer.display_first_last}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
````

## File: apps/web/src/app/page.tsx
````typescript
'use client';

import GameModeCard from '@/components/gamemodecard';

export default function Home() {
  return (
    <div className="h-full flex flex-row justify-center space-x-8">
      <GameModeCard
        className="w-1/2"
        title="Single Player"
        description="Test your own knowledge, but you only have 5 lives."
        href="/singleplayer"
        imageHref="/images/jaylenbrown.jpg"
      />
      <GameModeCard
        className="w-1/2"
        title="Multiplayer"
        description="Compete against friends and come out on top."
        href="/multiplayer"
        imageHref="/images/jaysontatum.webp"
      />
    </div>
  );
}
````

## File: apps/web/src/hooks/useMultiplayerSocket.ts
````typescript
'use client';

import { clientSocket } from '@/lib/clientsocket';
import { useUser } from '@auth0/nextjs-auth0';
import { nba, users } from '@dribblio/database';
import {
  GameState,
  HostRoomMessageBody,
  JoinRoomMessageBody,
  MultiplayerConfig,
  UserGameInfo,
} from '@dribblio/types';
import { useEffect, useState } from 'react';

type RoomProps = {
  id: string;
  users: users.User[];
};

type RoundProps = {
  roundActive: boolean;
  timeLeft: number;
  users: UserGameInfo[];
  team_history: string[];
  players: nba.Player[];
};

const useMultiplayerSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);

  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [users, setUsers] = useState<UserGameInfo[]>([]);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [validAnswers, setValidAnswers] = useState<nba.Player[]>([]);

  const [teams, setTeams] = useState<string[] | null>(null);

  const [players, setPlayers] = useState<nba.Player[]>([]);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { user } = useUser();

  // From Server
  function onRoomUpdated({ id, users }: RoomProps) {
    setRoomId(id);
    setUsers(users.map((user: users.User) => ({ info: user, score: 0 })));
  }
  function onNextRound({ roundActive, timeLeft, team_history, users, players }: RoundProps) {
    setRoundActive(roundActive);
    setTimeLeft(timeLeft);
    setUsers(users);
    setTeams(team_history);
    setPlayers(players);
  }
  function onTimerUpdated({ timeLeft }: { timeLeft: number }) {
    setTimeLeft(timeLeft);
  }
  function onEndRound({ roundActive, users, validAnswers }: GameState) {
    setRoundActive(roundActive);
    setUsers(users);
    setValidAnswers(validAnswers);
  }

  // To Server
  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setIsConnected(false);
  }
  function onHostRoom(config: MultiplayerConfig) {
    if (!user) return;

    const body: HostRoomMessageBody = { isMulti: true, userId: user.sub, config };
    clientSocket.emit('host_room', body);
    setCanStartGame(true);
  }
  function onJoinRoom(roomId: string) {
    if (!user) return;

    const body: JoinRoomMessageBody = { roomId, userId: user.sub };
    clientSocket.emit('join_room', body);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game', users);
  }
  function onGuess(guessId: number) {
    if (!user) return;

    clientSocket.emit('client_guess', { userId: user.sub, guessId });
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('room_updated', onRoomUpdated);
    clientSocket.on('next_round', onNextRound);
    clientSocket.on('timer_updated', onTimerUpdated);
    clientSocket.on('end_round', onEndRound);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('room_updated', onRoomUpdated);
      clientSocket.off('next_round', onNextRound);
      clientSocket.off('timer_updated', onTimerUpdated);
      clientSocket.off('end_round', onEndRound);
      clientSocket.disconnect();
    };
  }, []);

  return {
    socketId: clientSocket.id,
    isConnected,
    roundActive,
    roomId,
    canStartGame,
    onStartGame,
    users,
    onHostRoom,
    onJoinRoom,
    teams,
    players,
    onGuess,
    timeLeft,
    validAnswers,
  };
};

export default useMultiplayerSocket;
````

## File: packages/database/src/index.ts
````typescript
export * as nba from '../generated/prisma-nba/index.js';
export * as users from '../generated/prisma-users/index.js';
export * from './client.js';

export * as runtime from '@prisma/client/runtime/library.js';
````

## File: packages/database/package.json
````json
{
  "name": "@dribblio/database",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "db:generate": "prisma generate --schema ./prisma-users/schema.prisma && prisma generate --schema ./prisma-nba/schema.prisma",
    "db:migrate": "prisma migrate dev --schema ./prisma-users/schema.prisma",
    "data-migration:add-display-name-and-profile-url": "tsx ./prisma-users/migrations/20250616000523_add_display_name_and_profile_url/data-migration.ts"
  },
  "devDependencies": {
    "@types/node": "^24.0.1",
    "prisma": "^6.7.0",
    "ts-node": "^10.9.2",
    "tsx": "^4.20.3",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "@prisma/client": "^6.6.0",
    "prisma-json-types-generator": "^3.3.1"
  }
}
````

## File: packages/types/src/statemachine/index.ts
````typescript
export * from './actors.js';
export * from './gamedifficulties.js';
export * from './gameservice.js';
export * from './multiplayer/index.js';
export * from './singleplayer/index.js';
````

## File: packages/types/src/websocket/index.ts
````typescript
export * from './messagebodies.js';
export * from './playerguess.js';
export * from './room.js';
````

## File: packages/types/src/websocket/room.ts
````typescript
import { users } from '@dribblio/database';
import { Actor, AnyStateMachine } from 'xstate';
import { MultiplayerConfig } from '../statemachine/multiplayer/gamemachine.js';
import { SinglePlayerConfig } from '../statemachine/singleplayer/gamemachine.js';

export interface Room {
  id: string;
  statemachine: Actor<AnyStateMachine> | undefined;
  users: users.User[];
  config: SinglePlayerConfig | MultiplayerConfig;
  isMulti: boolean;
}
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# Dependencies
node_modules
/pnp
.pnp.js

# Local env files
**/.env
**/.env.local
**/.env.development.local
**/.env.test.local
**/.env.production.local

# Testing
coverage

# Turbo
.turbo

# Vercel
.vercel

# Build Outputs
.next/
out/
build
dist

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.DS_Store
*.pem

# production
/build

# next.js
/.next/
/out/

# typescript
*.tsbuildinfo
next-env.d.ts
**/*-lock.json
````

## File: apps/api/src/nba/games/careerpath/room/factory.service.ts
````typescript
import { CareerPathGateway } from '@/nba/games/careerpath/careerpath.gateway';
import { GameService } from '@/nba/games/careerpath/game.service';
import { users } from '@dribblio/database';
import {
  createMultiplayerMachine,
  createSinglePlayerMachine,
  MultiplayerConfig,
  PlayerGuess,
  Room,
  SinglePlayerConfig,
} from '@dribblio/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class RoomFactory {
  constructor(
    @Inject(forwardRef(() => CareerPathGateway))
    private gateway: CareerPathGateway,
    private gameService: GameService,
  ) {}

  createSinglePlayerRoom(socket: Socket, config: SinglePlayerConfig): Room {
    const room: Room = {
      id: '',
      statemachine: undefined,
      users: [],
      config,
      isMulti: false,
    };

    room.statemachine = createSinglePlayerMachine(socket, room.config, this.gameService);

    socket.on('start_game', () => {
      room.statemachine?.subscribe((s) => {
        socket.emit('state_change', s.value);
      });

      socket.on('skip_round', () => room.statemachine?.send({ type: 'SKIP' }));

      socket.on('disconnect', () => {
        room.statemachine?.stop();
      });

      room.statemachine?.send({ type: 'START_GAME', socket });
    });

    return room;
  }

  createMultiplayerRoom(socket: Socket, roomId: string, config: MultiplayerConfig): Room {
    const room: Room = {
      id: roomId,
      statemachine: undefined,
      users: [],
      config: config,
      isMulti: true,
    };

    room.statemachine = createMultiplayerMachine(this.gateway.server, room, this.gameService);

    socket.on('start_game', (users: users.User[]) => {
      room.statemachine?.subscribe((s) => {
        this.gateway.server.to(room.id).emit('state_change', s.value);
      });

      room.statemachine?.send({ type: 'START_GAME', users });
    });

    return room;
  }

  setUpListenersOnJoin(socket: Socket, room: Room) {
    socket.on('client_guess', (guess: PlayerGuess) => {
      room.statemachine?.send({ type: 'CLIENT_GUESS', guess });
    });

    socket.on('disconnect', () => {
      room.statemachine?.stop();
    });
  }
}
````

## File: apps/api/src/nba/player/player.controller.ts
````typescript
import { PlayersService } from '@/nba/player/player.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('random')
  async findRandom() {
    return await this.playerService.findRandom();
  }

  @Get('count')
  async findCount() {
    return await this.playerService.findCount();
  }

  @Get('search')
  async search(@Query('searchTerm') searchTerm: string) {
    const results = await this.playerService.findAll({
      orderBy: {
        last_name: 'asc',
      },
      where: {
        display_first_last: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    return {
      results,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.playerService.findOne(+id);
  }
}
````

## File: apps/api/src/users/users.service.ts
````typescript
import { UsersPrismaService } from '@/database/users.prisma.service';
import { AvatarService } from '@/users/avatar.service';
import { S3Service } from '@/users/s3.service';
import { UpdateUserDto } from '@dribblio/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userPrisma: UsersPrismaService,
    private readonly s3Service: S3Service,
    private readonly avatarService: AvatarService,
  ) {}

  async get(id: string) {
    const user = await this.userPrisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userPrisma.user.update({
      where: { id: id },
      data: {
        display_name: updateUserDto.display_name ?? '',
        name: updateUserDto.name ?? '',
      },
    });
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const profile_url = await this.avatarService.uploadAvatar(userId, file);

    return await this.userPrisma.user.update({
      where: { id: userId },
      data: { profile_url },
    });
  }
}
````

## File: apps/web/src/components/config/multiplayer/joinhostmodal.tsx
````typescript
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hostSchema, joinSchema } from '@/lib/schemas';
import {
  GameDifficulties,
  GameDifficultyNames,
  GameDifficultySchema,
  HostFormValues,
  JoinFormValues,
  MultiplayerConfig,
} from '@dribblio/types';
import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from 'react-hook-form';

export default function JoinHostModal({
  isOpen,
  onJoinRoom,
  onHostRoom,
}: Readonly<{
  isOpen: boolean;
  onJoinRoom: (roomId: string) => void;
  onHostRoom: (config: MultiplayerConfig) => void;
}>) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Join or Host a Game</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="join">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join Room</TabsTrigger>
            <TabsTrigger value="host">Host Room</TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <JoinForm onJoinRoom={onJoinRoom} />
          </TabsContent>
          <TabsContent value="host">
            <HostForm onHostRoom={onHostRoom} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function JoinForm({
  onJoinRoom,
}: Readonly<{
  onJoinRoom: (roomId: string) => void;
}>) {
  const form = useForm<JoinFormValues>({
    resolver: joiResolver(joinSchema),
    defaultValues: {
      roomId: '',
    },
  });

  function onSubmit(values: JoinFormValues) {
    onJoinRoom(values.roomId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Code</FormLabel>
                <FormControl>
                  <Input placeholder="Room Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Join Room</Button>
        </div>
      </form>
    </Form>
  );
}

function HostForm({
  onHostRoom,
}: Readonly<{
  onHostRoom: (config: MultiplayerConfig) => void;
}>) {
  const form = useForm<HostFormValues>({
    resolver: joiResolver(hostSchema),
    defaultValues: {
      isRoundLimit: false,
      config: {
        scoreLimit: 10,
        roundLimit: 10,
        roundTimeLimit: 30,
        gameDifficulty: GameDifficulties.firstAllNBA.name,
      },
    },
  });

  function onSubmit(values: HostFormValues) {
    const config = {
      ...values.config,
      scoreLimit: values.isRoundLimit ? values.config.scoreLimit : undefined,
      roundLimit: values.isRoundLimit ? values.config.roundLimit : undefined,
      gameDifficulty: GameDifficultySchema.parse(values.config.gameDifficulty),
    };
    onHostRoom(config);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4 self-center">
            <p>Score Limit</p>
            <FormField
              control={form.control}
              name="isRoundLimit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <p>Round Limit</p>
          </div>
          {form.watch('isRoundLimit') && (
            <FormField
              control={form.control}
              name="config.roundLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Round Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Round Limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          )}
          {!form.watch('isRoundLimit') && (
            <FormField
              control={form.control}
              name="config.scoreLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Score Limit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          )}
          <FormField
            control={form.control}
            name="config.roundTimeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Time Limit</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Round Time Limit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="config.gameDifficulty"
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
          ></FormField>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Create Room</Button>
        </div>
      </form>
    </Form>
  );
}
````

## File: apps/web/src/hooks/useSinglePlayerSocket.ts
````typescript
'use client';

import { clientSocket } from '@/lib/clientsocket';
import { nba } from '@dribblio/database';
import { HostRoomMessageBody, SinglePlayerConfig } from '@dribblio/types';
import { useEffect, useState } from 'react';

type ClientSocketProps = {
  correctAction: (validAnswers: nba.Player[]) => void;
  incorrectAction: () => void;
};

type StateProps = {
  gameActive?: string;
};

type RoundProps = {
  score: number;
  team_history: string[];
  lives: number;
};

type CorrectGuessProps = {
  validAnswers: nba.Player[];
};

type IncorrectGuessProps = {
  lives: number;
};

const useSinglePlayerSocket = ({ correctAction, incorrectAction }: ClientSocketProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRoomConfigured, setIsRoomConfigured] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(true);
  const [machineState, setMachineState] = useState<string>('waitingForGameStart');

  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);
  const [lives, setLives] = useState<number>(0);

  // From Server
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'waitingForGameStart');
  }
  function onNextRound({ score, team_history, lives }: RoundProps) {
    setScore(score);
    setTeams(team_history);
    setLives(lives);
  }
  function onSkipped({ lives }: IncorrectGuessProps) {
    setLives(lives);
  }
  function onGameOver() {
    setCanStartGame(true);
    setScore(0);
    setTeams(null);
  }

  // To Server
  function onConnect() {
    setIsConnected(true);
    setCanStartGame(true);
  }
  function onDisconnect() {
    setIsConnected(false);
    setMachineState('waitingForGameStart');
    setScore(0);
    setTeams(null);
  }
  function onConfigureRoom(config: SinglePlayerConfig) {
    const body: HostRoomMessageBody = { isMulti: false, userId: '', config };
    clientSocket.emit('host_room', body);
    setIsRoomConfigured(true);
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game');
  }
  function onGuess(guessId: number) {
    clientSocket.emit('client_guess', { userId: '', guessId });
  }
  function onSkip() {
    clientSocket.emit('skip_round');
  }

  useEffect(() => {
    function onCorrectGuess({ validAnswers }: CorrectGuessProps) {
      correctAction(validAnswers);
    }
    function onIncorrectGuess({ lives }: IncorrectGuessProps) {
      setLives(lives);
      incorrectAction();
    }

    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('correct_guess', onCorrectGuess);
    clientSocket.on('incorrect_guess', onIncorrectGuess);
    clientSocket.on('round_skipped', onSkipped);
    clientSocket.on('next_round', onNextRound);
    clientSocket.on('game_over', onGameOver);

    clientSocket.connect();

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.off('state_change', onStateChange);
      clientSocket.off('correct_guess', onCorrectGuess);
      clientSocket.off('incorrect_guess', onIncorrectGuess);
      clientSocket.off('round_skipped', onSkipped);
      clientSocket.off('next_round', onNextRound);
      clientSocket.off('game_over', onGameOver);

      clientSocket.disconnect();
    };
  }, []);

  return {
    isConnected,
    canStartGame,
    isRoomConfigured,
    onConfigureRoom,
    onStartGame,
    machineState,
    score,
    teams,
    lives,
    onGuess,
    onSkip,
  };
};

export default useSinglePlayerSocket;
````

## File: packages/types/src/statemachine/singleplayer/gamemachine.ts
````typescript
import { nba } from '@dribblio/database';
import { Socket } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';
import { generateRound } from '../actors.js';
import { GameDifficulty } from '../gamedifficulties.js';
import { BaseGameService } from '../gameservice.js';
import {
  notifyCorrectGuess,
  notifyGameOver,
  notifyIncorrectGuess,
  notifySkipRound,
  sendPlayerToClient,
  waitForUser,
} from './actions.js';
import { hasLives, isCorrectSinglePlayer } from './guards.js';

export type SinglePlayerConfig = {
  gameDifficulty: GameDifficulty;
};

export type SinglePlayerContext = {
  socket: Socket;
  config: SinglePlayerConfig;
  gameState: {
    score: number;
    validAnswers: nba.Player[];
    lives: number;
  };
};

export function createSinglePlayerMachine(
  socket: Socket,
  config: SinglePlayerConfig,
  gameService: BaseGameService,
): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: SinglePlayerContext;
    },
    actions: {
      waitForUser,
      sendPlayerToClient,
      notifyCorrectGuess,
      notifyIncorrectGuess,
      notifySkipRound,
      notifyGameOver,
    },
    actors: {
      generateRound,
    },
    guards: {
      isCorrectSinglePlayer,
      hasLives,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHQDuqxALmVAGID2ATmpgMp2pt0BiLgBUAggCVhAfWSicAUQDaABgC6iUAAcWsesRakNIAB6IATAFYLFAJyWA7ABZlNgGyvlAZk8BGMwBoQAE9EAA4fTwpHR09Q6LtlZQszMwBfVMDObDwiMkooDDBRfAYAN0pYXn5GLIEVdSQQbV0GAyNTBD9XUIoXT3szV3tk0OGLQJCERx8eqwjhn26zRc90zMLcAhJyCgLMYrL8sHI2VAZSKHEWAFdSCAEIA0oyUpYAa0oszdydvaKS4jlXbHMCnc6XG53BAvFj4M76Uj1epGZp6NqNDpdHp9AZDEZjCaICyxKKhVxmez2FahZRmRxrEBfHLbfKFA6Ayg0PQXVgca5wWACADCABkAJLyABy0mQAFV5FwuMjGqjWoYMYhXFYKOELC4LDZaRFXD5CQhXM5ehbPMoLRFHGYbAymVs8rs2QCgVzwbzkPzYIKuABpMUABWVWh0aPVoExiRsFHsZIdjnCNhtMzNVLMOpNoTpnhsBsWFmdG2Zbr+7KBsDexE0mkYV1u9wjTSjavaiCxvXTuOGZlGVjNrhtiYN9k80WmrhsPh8Zcw3xZ7v2noqdYbTchrZ8DUjLQRXc6g2xfcGA6H42CiAGPgoyXTynCjlnowXGUZ5ddvw9hwomhsLCAo1P6gptqqR4auaDoPhSjrdDSnhDGalg5nOdgmlqoQ4fYWqLtkP6smu-6AcBAagQKdR7iiHZQbGmqwckAxuDhXgoTe5qhAmOE2HhZKTj4yj2E6n4uj8xH-KRQH4CBFx+lRihmPu7aHuiDEwTmzEIWxyH2GaoSFhQ3RFjMU5uD4FiuARy6Vn+HKrmAADy5RsHUai0WpMYmOY2p2BYTguO4Xi+AEnHhBQngpDYqbPsShnpukn6kCwEBwEY4ksp50bHgAtK4Zq5dYNglaVZWlchNkVjs3qML6hQ8HwdDZZ20EOmadjGWS2GGdMd5VURjnVmALX0T5CCFgmMwpK+sQOvOAVmiWD5uFO85CTE0RpGJ34SUN64UJUTU1IUo3qeN84uBQPipv0lLTFF3FmoWkQ0s4qYWAtnhWPSO1LtVknDcCJzwhczZ3Gd3mYo4c6RSFSTpq++aOCOyj3rxgyJFjQmln9hF7VWB21Ty7AKQGkPHvmsxCYWdp4bdWbKI4tipn4aNONEU4DQT9k1pujZgzuFPQZd1h4UWUUuHhThZhEvSOsMpURDMuPrP9g2E9J5G6PJYHCxp0T2Nd+Z0qOcTLJZ+mcfYTNdc+sQI4Ok7cyumsOX8LmgvrF3JOj3FmLEs4WPmw7hWO33BcHuruPYSWpEAA */
    id: `single-game-machine`,
    initial: 'waitingForGameStart',
    context: {
      socket,
      config,
      gameState: {
        score: 0,
        validAnswers: [],
        lives: 0,
      },
    },
    states: {
      waitingForGameStart: {
        entry: assign({
          gameState: { score: 0, validAnswers: [], lives: 0 },
        }),
        on: {
          START_GAME: 'gameActive',
        },
      },

      gameActive: {
        initial: 'startingGame',
        states: {
          startingGame: {
            entry: assign(({ context }) => ({
              gameState: { ...context.gameState, lives: 4 },
            })),
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              input: { difficulty: config.gameDifficulty, gameService },
              onDone: {
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      validAnswers: event.output.validAnswers,
                    },
                  });
                  enqueue('sendPlayerToClient');
                }),
              },
            },
          },
          waitingForGuess: {
            on: {
              CLIENT_GUESS: 'processingGuess',
              SKIP: 'skippingRound',
            },
          },
          skippingRound: {
            always: [
              {
                guard: 'hasLives',
                target: 'generatingRound',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
                  });
                  enqueue('notifySkipRound');
                }),
              },
              { target: 'gameOver' },
            ],
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrectSinglePlayer',
                target: 'generatingRound',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      score: context.gameState.score + 1,
                    },
                  });
                  enqueue('notifyCorrectGuess');
                }),
              },
              {
                guard: 'hasLives',
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, enqueue }) => {
                  enqueue.assign({
                    gameState: { ...context.gameState, lives: context.gameState.lives - 1 },
                  });
                  enqueue('notifyIncorrectGuess');
                }),
              },
              { target: 'gameOver' },
            ],
          },
          gameOver: {
            always: {
              target: '#single-game-machine.waitingForGameStart',
              actions: 'notifyGameOver',
            },
          },
        },
      },
    },
  });

  return createActor(gameMachine).start();
}
````

## File: packages/types/package.json
````json
{
  "name": "@dribblio/types",
  "type": "module",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@dribblio/typescript-config": "*",
    "typescript": "latest"
  },
  "dependencies": {
    "class-validator": "^0.14.2",
    "joi": "^17.13.3",
    "socket.io": "^4.8.1",
    "xstate": "^5.19.2",
    "zod": "^3.25.28"
  }
}
````

## File: apps/api/src/auth/jwt.strategy.ts
````typescript
import { Auth0JwtPayload } from '@/auth/payload.type';
import { UserInfo } from '@/auth/userinfo.type';
import { UsersPrismaService } from '@/database/users.prisma.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersPrismaService: UsersPrismaService) {
    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  private async getUserProfileInfo(issuer: string, token: string | null): Promise<UserInfo> {
    const userInfoUrl = `${issuer}userinfo`;
    const response = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile info');
    }

    return response.json();
  }

  async validate(req: Request, payload: Auth0JwtPayload, done: VerifiedCallback): Promise<unknown> {
    let user = await this.usersPrismaService.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const userInfo = await this.getUserProfileInfo(payload.iss, token);
      user = await this.usersPrismaService.user.create({
        data: {
          id: payload.sub,
          name: userInfo.name || '',
          display_name: userInfo.given_name || '',
          profile_url: userInfo.picture || '',
        },
      });
    }

    return done(null, { id: user.id });
  }
}
````

## File: apps/api/src/app.module.ts
````typescript
import { AuthModule } from '@/auth/auth.module';
import { NBAModule } from '@/nba/nba.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NBAModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
````

## File: apps/web/src/components/navbar/navbar.tsx
````typescript
'use client';

import { Dock, DockIcon } from '@/components/magicui/dock';
import ThemeSwitcher from '@/components/navbar/themeswitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { useDBUser } from '@/context/dbusercontext';
import { cn } from '@/lib/utils';
import { LogIn, User as UserIcon } from 'lucide-react';
import NextLink from 'next/link';

export default function NBANavbar({ className }: Readonly<{ className?: string }>) {
  const { user } = useDBUser();

  return (
    <div className={`${className}`}>
      <TooltipProvider>
        <Dock className="rounded-full" iconMagnification={60} iconDistance={25}>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                {user ? (
                  <NextLink href="/profile">
                    {user.profile_url ? (
                      <Avatar>
                        <AvatarImage
                          src={user.profile_url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon />
                    )}
                  </NextLink>
                ) : (
                  <a
                    href="/auth/login"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' }),
                    )}
                  >
                    <LogIn />
                  </a>
                )}
              </TooltipTrigger>
              <TooltipContent>{user ? <p>Profile</p> : <p>Login</p>}</TooltipContent>
            </Tooltip>
          </DockIcon>
          <Separator orientation="vertical" className="h-full py-2" />
          {siteConfig.navItems.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NextLink
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' }),
                    )}
                  >
                    <item.icon />
                  </NextLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <ThemeSwitcher />
        </Dock>
      </TooltipProvider>
    </div>
  );
}
````

## File: packages/database/.gitignore
````
node_modules
# Keep environment variables out of version control
.env

**/generated/
````

## File: packages/types/src/statemachine/actors.ts
````typescript
import { fromPromise } from 'xstate';

import { nba } from '@dribblio/database';
import { GameDifficulty } from './gamedifficulties.js';
import { BaseGameService } from './gameservice.js';

type RoundInput = {
  input: {
    difficulty: GameDifficulty;
    gameService: BaseGameService;
  };
};

export type RoundProps = {
  validAnswers: nba.Player[];
  players: nba.Player[];
};

export const generateRound = fromPromise(async ({ input }: RoundInput): Promise<RoundProps> => {
  const { difficulty, gameService } = input;
  return await gameService.generateRound(difficulty);
});
````

## File: packages/types/src/index.ts
````typescript
export * from './dtos/index.js';
export * from './forms/index.js';
export * from './responses/index.js';
export * from './statemachine/index.js';
export * from './websocket/index.js';
````

## File: turbo.json
````json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "start": {
      "dependsOn": ["^start"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": [
        "DATABASE_URL",
        "AUTH0_DOMAIN",
        "AUTH0_AUDIENCE",
        "AUTH0_CLIENT_ID",
        "AUTH0_CLIENT_SECRET",
        "AUTH0_SECRET",
        "AUTH0_SCOPE",
        "PORT",
        "AWS_S3_BUCKET_NAME",
        "AWS_CLOUDFRONT_CNAME",
        "AWS_CLOUDFRONT_KEY_PAIR_ID",
        "AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME"
      ]
    },
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": [
        "DATABASE_URL",
        "AUTH0_DOMAIN",
        "AUTH0_AUDIENCE",
        "AUTH0_CLIENT_ID",
        "AUTH0_CLIENT_SECRET",
        "AUTH0_SECRET",
        "AUTH0_SCOPE",
        "PORT",
        "AWS_S3_BUCKET_NAME",
        "AWS_CLOUDFRONT_CNAME",
        "AWS_CLOUDFRONT_KEY_PAIR_ID",
        "AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME"
      ]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    }
  }
}
````

## File: apps/api/src/main.ts
````typescript
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT ?? 3002);
}
dotenv.config();
bootstrap();
````

## File: packages/types/src/statemachine/multiplayer/gamemachine.ts
````typescript
import { nba, users } from '@dribblio/database';
import { Server } from 'socket.io';
import { Actor, AnyStateMachine, assign, createActor, enqueueActions, setup } from 'xstate';
import { PlayerGuess } from '../../websocket/playerguess.js';
import { Room } from '../../websocket/room.js';
import { generateRound } from '../actors.js';
import { GameDifficulty } from '../gamedifficulties.js';
import { BaseGameService } from '../gameservice.js';
import { sendPlayerToRoom, sendRoundInfoToRoom, sendTimerToRoom } from './actions.js';
import { isCorrectMultiplayer, timeExpired } from './guards.js';

export type UserGameInfo = {
  info: users.User;
  score: number;
};

export type GameState = {
  roundActive: boolean;
  timeLeft: number;
  currentRound: number;
  users: UserGameInfo[];
  validAnswers: nba.Player[];
};

export type MultiplayerConfig = {
  scoreLimit?: number | undefined;
  roundLimit?: number | undefined;
  roundTimeLimit: number;
  gameDifficulty: GameDifficulty;
};

export type MultiplayerContext = {
  io: Server;
  room: Room;
  config: MultiplayerConfig;
  gameState: GameState;
};

const updateUserScore = (users: UserGameInfo[], currentGuess: PlayerGuess): UserGameInfo[] => {
  const otherUsers = users.filter((user) => user.info.id !== currentGuess.userId);
  const currentUser = users.find((user) => user.info.id === currentGuess.userId)!;

  return [...otherUsers, { ...currentUser, score: currentUser.score + 1 }];
};

export function createMultiplayerMachine(
  io: Server,
  room: Room,
  gameService: BaseGameService,
): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: MultiplayerContext;
    },
    actions: {
      sendPlayerToRoom,
      sendRoundInfoToRoom,
    },
    actors: {
      generateRound,
    },
    guards: {
      isCorrectMultiplayer,
      timeExpired,
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgHd1cAXAqAMQHsAnAcXVTAGUr0mqBiTgBUAggCUhAfRYiAsgFEA2gAYAuolAAHBrGq4G+DSAAeiAKwAmADQgAnogAsATgBsJAMxmAjC+UWAHBZmZn4AvqE2aFh4hKRQ7GAimDQAbmAksDx8tGwc-CrqSCDaujQGRqYIDn4kThZe-g4Oll4A7F5ODjb2Vc0k-k7uyoH17g7+-q1m4ZEYOATEJPEcSanpMIRM6DT4UGIMAK74EPwQBukEKQwA1ulR87FLCau4aUtgm9u0+0cQCJcMTBfAwFApGEp6cpFSqtAK1FyTdytZRORrKdz+brmVr+EgWZz+YJeCztMxOVozED3GKLZaJZKvdIUPS7RisA5wWD8ADCABkAJLyAByUhYAFV5JxOGCihCyoZoYhBm5-J5OhYMS4EV53FiEESSLCXO4nJYAoT3F5KdSFnFngy3sydvRmCwObAuTKtDpIQrQJUvF4USQ2g0zDjlM5I3rfLjyS4mk5yU4Gl4HNa5jS7SsHelNExAZycu7PWpwT75RVEIGQoaQsNPAMXGmnHqHEGSM5US4pkiTe3whEQPgGBA4EYbbFy6V9H6TIgALQuPVLkjKdcbzebilDyeLJ20Nm5LhZKjT31VqrWOyIfxeEj19fIhwWbX+FwZ6K2p45tbnyuKggHRmLUZiWhYTjrhM7guK2N4IO4FgWLUSbkmSHT4lqn4PLS9prBkp45Ak-6zpe+LuKB4GQcMqqwW29QeIMyjeM0CJjBY2FZj+9L4RsYBbM6PzHCRUL+o4qJrl4wTvkGUykvR94mkMLFmGxL6cd+dIvI6lDOkeJYiXOlSDMhAzKM2xqtL4qmYvBvitHir4OK0poQa57gaY8Wm5iQ+aFh6xacoZl7EpMtRImBsFDI0rT0RRAzRUmlo9k4g6hEAA */
    id: `multi-game-machine-${room.id}`,
    initial: 'waitingForGameStart',
    context: {
      io,
      room,
      config: room.config! as MultiplayerConfig,
      gameState: {
        roundActive: false,
        timeLeft: 0,
        currentRound: 0,
        users: [],
        validAnswers: [],
      },
    },
    states: {
      waitingForGameStart: {
        on: {
          START_GAME: 'gameActive',
        },
      },

      gameActive: {
        initial: 'startingGame',
        states: {
          startingGame: {
            entry: assign(({ context, event }) => ({
              gameState: {
                ...context.gameState,
                users: event.users,
              },
            })),
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              input: { difficulty: room.config!.gameDifficulty, gameService },
              onDone: {
                target: 'waitingForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      ...context.gameState,
                      roundActive: true,
                      timeLeft: context.config.roundTimeLimit,
                      validAnswers: event.output.validAnswers,
                    },
                  });
                  enqueue('sendPlayerToRoom');
                }),
              },
            },
          },
          waitingForGuess: {
            after: {
              1000: {
                target: 'waitingForGuess',
                reenter: true,
              },
            },
            always: [{ guard: 'timeExpired', target: 'endRound' }],
            on: {
              CLIENT_GUESS: [
                {
                  guard: 'isCorrectMultiplayer',
                  target: 'endRound',
                  actions: [
                    assign(({ context, event }) => ({
                      ...context,
                      gameState: {
                        ...context.gameState,
                        users: updateUserScore(context.gameState.users, event.guess),
                      },
                    })),
                  ],
                },
              ],
            },
            exit: [
              assign(({ context }) => ({
                ...context,
                gameState: {
                  ...context.gameState,
                  timeLeft: Math.max(0, context.gameState.timeLeft - 1),
                },
              })),
              sendTimerToRoom,
            ],
          },
          endRound: {
            entry: enqueueActions(({ context, enqueue }) => {
              enqueue.assign({
                ...context,
                gameState: {
                  ...context.gameState,
                  roundActive: false,
                },
              });
              enqueue('sendRoundInfoToRoom');
            }),
            after: {
              3000: {
                target: 'generatingRound',
              },
            },
          },
        },
      },
    },
  });

  return createActor(gameMachine).start();
}
````

## File: apps/web/src/app/profile/page.tsx
````typescript
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
````

## File: README.md
````markdown
# dribbl.io

This is a NBA career path guessing game. Guess the NBA player based on the presented career path. Play against friends in Multiplayer or simply test your ball knowledge in Single Player.

## Game Features

### Single Player Mode

- Progressive difficulty levels
- Score tracking (+1 point per correct answer)
- Lives system (-1 life per incorrect answer)
- Game ends when all lives are lost
- Option to restart with a new game
- Player statistics

### Multiplayer Mode

- Room-based gameplay
  - Host creates a room and receives a room code
  - Players join using the room code
  - Players can leave by navigating away
- Real-time gameplay
  - All players see the same team history
  - Round ends when:
    - A player correctly guesses the player
    - Round time limit is reached
  - After each round:
    - All acceptable answers are shown
    - New round automatically starts
- Live score updates
- Competitive gameplay

### Authentication & User Management

- **Auth0 Integration**: Secure user authentication and authorization
- **User Profiles**: Personalized user experience with profile management
- **Protected Routes**: Secure access to user-specific features
- **Social Login**: Support for Google and other social providers
- **JWT Tokens**: Secure API access with JWT-based authentication
- **Avatar Management**: Upload and crop profile pictures with secure S3 storage
- **Profile Editing**: Update display name and profile information

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [NestJS](https://nestjs.com) app that provides:
  - NBA player data API
  - Real-time game functionality via WebSockets
  - PostgreSQL database integration
  - **Auth0 JWT authentication and authorization**
  - **User management and profile endpoints**
  - **AWS S3 integration for avatar uploads**
  - **CloudFront signed URLs for secure avatar access**
- `web`: a [Next.js](https://nextjs.org/) app that provides:
  - Interactive game interface
  - Real-time multiplayer functionality
  - Responsive design
  - **Auth0 authentication integration**
  - **User profile management**
  - **Protected routes and middleware**
  - **Avatar editor with image cropping**
  - **Drag-and-drop file uploads**
- `@dribblio/database`: a Prisma ORM types library shared by both `web` and `api` applications
  - **NBA database schema** for player data
  - **Users database schema** for authentication and user profiles
- `@dribblio/types`: a Typescript types library shared by both `web` and `api` applications
- `@dribblio/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@dribblio/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- npm or yarn package manager
- **Auth0 account and application setup**
- **AWS account with S3 and CloudFront setup**

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dribbl.io.git
   cd dribbl.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   **API Environment Variables** (create `.env` file in the `api` directory):

   ```bash
   # Database URLs
   DATABASE_URL="postgresql://user:password@localhost:5432/dribblio"
   USERS_DATABASE_URL="postgresql://user:password@localhost:5432/dribblio_users"

   # Auth0 Configuration
   AUTH0_DOMAIN="your-domain.auth0.com"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_SECRET="your-secret"
   AUTH0_SCOPE="openid profile email"

   # AWS Configuration
   AWS_S3_BUCKET_NAME="your-s3-bucket-name"
   AWS_CLOUDFRONT_CNAME="your-cloudfront-domain.cloudfront.net"
   AWS_CLOUDFRONT_KEY_PAIR_ID="your-cloudfront-key-pair-id"
   AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME="your-secrets-manager-secret-name"

   # Server Configuration
   PORT=3002
   ```

   **Web Environment Variables** (create `.env.local` file in the `web` directory):

   ```bash
   # Auth0 Configuration
   AUTH0_SECRET="your-secret"
   AUTH0_BASE_URL="http://localhost:3000"
   AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
   AUTH0_CLIENT_ID="your-client-id"
   AUTH0_CLIENT_SECRET="your-client-secret"
   AUTH0_AUDIENCE="your-api-identifier"
   AUTH0_SCOPE="openid profile email"
   ```

4. **Set up Auth0 Application**:

   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Regular Web Application)
   - Configure callback URLs: `http://localhost:3000/api/auth/callback`
   - Configure logout URLs: `http://localhost:3000`
   - Create an API with appropriate scopes
   - Update the environment variables with your Auth0 configuration

5. **Set up AWS Services**:

   - Create an S3 bucket for avatar storage
   - Set up CloudFront distribution for secure avatar access
   - Create a CloudFront key pair for signed URLs
   - Store the private key in AWS Secrets Manager
   - Configure CORS on your S3 bucket
   - Update the environment variables with your AWS configuration

6. **Set up Databases**:

   ```bash
   # Generate Prisma clients
   npm run db:generate

   # Run database migrations
   npm run db:migrate
   ```

### Build

To build all apps and packages, run the following command:

```bash
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```bash
npm run dev
```

This will start:

- Next.js development server on port 3000
- NestJS development server on port 3002

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```bash
npx turbo login
npx turbo link
```

## License

Copyright (c) 2025 Cameron Slash. All Rights Reserved.

This software and associated documentation files (the "Software") are the proprietary property of Cameron Slash and are protected by copyright law. The Software is licensed, not sold.

You are not permitted to:

- Copy, modify, or create derivative works of the Software
- Reverse engineer, decompile, or disassemble the Software
- Remove or alter any proprietary notices or labels on the Software
- Use the Software for any commercial purpose
- Distribute, sublicense, or transfer the Software to any third party

Any unauthorized use, reproduction, or distribution of the Software is strictly prohibited and may result in severe legal consequences.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
````

## File: apps/api/package.json
````json
{
  "name": "api",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "jest --config=jest.lint.config.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.832.0",
    "@aws-sdk/client-secrets-manager": "^3.830.0",
    "@aws-sdk/cloudfront-signer": "^3.821.0",
    "@aws-sdk/lib-storage": "^3.832.0",
    "@dribblio/database": "*",
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "*",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/platform-socket.io": "^11.1.2",
    "@nestjs/websockets": "^11.1.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "dotenv": "^16.5.0",
    "eslint-plugin-jest": "^28.13.0",
    "jwks-rsa": "^3.2.0",
    "nestjs-cls": "^6.0.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@dribblio/types": "*",
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.10.7",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/multer": "^1.4.13",
    "@types/node": "^22.10.7",
    "@types/passport-jwt": "^4.0.1",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^29.7.0",
    "jest-runner-eslint": "^2.2.1",
    "prettier": "^3.4.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
````

## File: apps/web/package.json
````json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "jest --config=jest.lint.config.ts",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@auth0/nextjs-auth0": "^4.6.1",
    "@dribblio/database": "*",
    "@hookform/resolvers": "^5.1.1",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@react-stately/data": "^3.13.0",
    "@tailwindcss/postcss": "^4.1.7",
    "canvas-confetti": "^1.9.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "eslint-plugin-jest": "^28.13.0",
    "joi": "^17.13.3",
    "lucide-react": "^0.511.0",
    "motion": "^12.15.0",
    "next": "^15.3.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.0",
    "react-avatar-editor": "^14.0.0-beta.6",
    "react-dom": "^19.1.0",
    "react-dropzone": "^14.3.8",
    "react-image-crop": "^11.0.10",
    "react-toastify": "^11.0.5",
    "short-unique-id": "^5.3.2",
    "socket.io-client": "^4.8.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "unique-username-generator": "^1.4.0"
  },
  "devDependencies": {
    "@dribblio/eslint-config": "*",
    "@dribblio/types": "*",
    "@dribblio/typescript-config": "*",
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^22.15.3",
    "@types/react": "19.1.0",
    "@types/react-dom": "19.1.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.25.0",
    "jest-runner-eslint": "^2.2.1",
    "postcss": "^8",
    "tailwind-variants": "^0.3.1",
    "tailwindcss": "^3.4.17",
    "typescript": "5.8.2"
  }
}
````

## File: package.json
````json
{
  "name": "dribbl.io",
  "private": true,
  "scripts": {
    "start": "turbo run start",
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types",
    "db:migrate": "turbo run db:migrate --",
    "db:generate": "turbo run db:generate",
    "pack": "repomix"
  },
  "devDependencies": {
    "prettier": "^3.5.3",
    "turbo": "^2.5.2",
    "typescript": "^5.8.2"
  },
  "engines": {
    "node": ">=18"
  },
  "packageManager": "npm@11.2.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
````
