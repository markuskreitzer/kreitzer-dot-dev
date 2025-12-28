'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="justify-start text-lg"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg"
            onClick={() => navigate('/about')}
          >
            About
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg"
            onClick={() => navigate('/work')}
          >
            Work
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-lg"
            onClick={() => navigate('/blog')}
          >
            Blog
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
