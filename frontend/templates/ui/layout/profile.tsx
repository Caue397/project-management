'use client';

import { clientSessionQuery } from '@/network/queries/session.query';
import { logoutMutation } from '@/network/mutations/auth.mutation';
import { cn } from '@hale/components';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { useClickAway } from '@uidotdev/usehooks';
import { LuInfo, LuLogOut, LuSettings2 } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data } = clientSessionQuery();
  const { mutateAsync: logout, isPending: loggingOut } = logoutMutation();
  const [open, setOpen] = useState(false);
  const menuContainer = useClickAway<HTMLDivElement>(() => setOpen(false));
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative z-30" ref={menuContainer}>
      <div
        className={cn(
          'flex items-center gap-1',
          'bg-white/60 rounded-xl p-1',
          'select-none cursor-pointer'
        )}
        style={{ boxShadow: '0px 0px 0px 1px rgb(25 24 23 / 0.1) inset' }}
        onClick={() => setOpen(!open)}
      >
        <div
          className={cn(
            'text-sm  w-8 h-8 flex items-center justify-center rounded-xl',
            'bg-white text-blue border border-foreground/10 font-semibold'
          )}
        >
          {initials(`${data?.customer?.firstName} ${data?.customer?.lastName}`)}
        </div>
        <IoChevronDown className="text-foreground/30" size={14} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '200px' }}
            className={cn(
              'absolute top-11 right-0 bg-white rounded-xl z-30',
              'shadow-md border border-foreground/10 whitespace-nowrap'
            )}
          >
            <div className="p-4">
              <h1 className="text-sm font-medium">
                {data?.customer?.firstName} {data?.customer?.lastName}
              </h1>
              <p className="text-xs text-foreground/50">
                {data?.customer?.email}
              </p>
            </div>

            <hr className="border-foreground/10" />

            <div className="p-2 space-y-1">
              <Option
                icon={<LuSettings2 size={16} />}
                name="Settings"
                onClick={() => {
                  setOpen(false);
                  router.push('/settings');
                }}
              />

              <Option
                icon={<LuInfo size={16} />}
                name="Help Guide"
                onClick={() => {
                  setOpen(false);
                  router.push('/resources');
                }}
              />
            </div>

            <hr className="border-foreground/10" />

            <div className="p-2 space-y-1">
              <Option
                icon={<LuLogOut size={16} />}
                name={loggingOut ? 'Logging out...' : 'Log out'}
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-500/10"
                disabled={loggingOut}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({ icon, name, onClick, className, disabled }: OptionProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 rounded-lg hover:bg-foreground/[0.04] cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <h1 className="text-xs font-medium">{name}</h1>
      {icon}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((n, i, arr) => (i === 0 || i === arr.length - 1 ? n[0] : ''))
    .join('')
    .toUpperCase();

type OptionProps = {
  icon: ReactNode;
  name: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};
