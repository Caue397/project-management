'use client';
import { useState } from 'react';
import { LuLayoutGrid } from 'react-icons/lu';
import { AnimatePresence } from 'framer-motion';
import SidebarMobile from './sidebar-mobile';

export default function MenuMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 cursor-pointer rounded-xl bg-white border border-foreground/10 flex items-center justify-center"
      >
        <LuLayoutGrid size={22} />
      </button>
      <AnimatePresence>
        {open && <SidebarMobile close={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
