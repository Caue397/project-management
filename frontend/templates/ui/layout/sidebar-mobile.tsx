'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  LuArchive,
  LuX,
  LuFiles,
  LuInbox,
  LuLayers,
  LuMessageSquare,
  LuSettings2,
  LuColumns3,
} from 'react-icons/lu';
import ActiveLink from '../../active-link';
import { productsQuery } from '@/network/queries/product.query';
import { countOrders } from '@/network/queries/draft-order.query';
import HaleLogo from '+/hale_elephant_blue.svg';
import Image from 'next/image';
import { unreadMessagesQuery } from '@/network/queries/chat.query';
import { countDealerMessagesQuery } from '@/network/queries/dealer-message.query';

export default function SidebarMobile({ close }: { close: () => void }) {
  const { data: products } = productsQuery();
  const { data: orders } = countOrders();
  const { data: unreadMessages } = unreadMessagesQuery();
  const { data: unreadDealerMessages } = countDealerMessagesQuery();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-40 fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-start"
    >
      <motion.aside
        className="rounded-r-2xl whitespace-nowrap overflow-hidden max-w-[280px] w-full bg-white border-r border-foreground/10 h-screen p-4 space-y-6"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="flex justify-between items-center">
          <Image
            className="min-w-[40px]"
            src={HaleLogo}
            alt="Hale Logo"
            width={40}
            height={40}
          />
          <button
            onClick={close}
            className="p-1.5 rounded-full bg-foreground/[0.02] border border-foreground/20"
          >
            <LuX size={18} />
          </button>
        </div>

        <section className="space-y-5">
          <SidebarCategory name="Overview">
            <NavegationItem
              name="Orders"
              href="/orders"
              icon={<LuFiles size={18} />}
              close={close}
              badge={
                orders && (
                  <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                    {orders?.draftOrdersCount?.count || 0}
                  </span>
                )
              }
            />

            <NavegationItem
              name="Chat"
              href="/chat"
              icon={<LuMessageSquare size={18} />}
              close={close}
              badge={
                orders && (
                  <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                    {unreadMessages}
                  </span>
                )
              }
            />
          </SidebarCategory>

          <SidebarCategory name="Dealer">
            <NavegationItem
              name="Dealer Store"
              href="/dealer-store"
              icon={<LuArchive size={18} />}
              close={close}
              badge={
                products && (
                  <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                    {products.products.nodes.length}
                  </span>
                )
              }
            />

            <NavegationItem
              name="Custom Order"
              href="/custom-order"
              close={close}
              icon={<LuColumns3 size={18} />}
            />

            <NavegationItem
              name="Settings"
              href="/settings"
              close={close}
              icon={<LuSettings2 size={18} />}
            />

            <NavegationItem
              name="Resources"
              href="/resources"
              close={close}
              icon={<LuLayers size={18} />}
            />
          </SidebarCategory>

          <SidebarCategory name="Operational">
            <NavegationItem
              name="Inbox"
              href="/inbox"
              close={close}
              icon={<LuInbox size={18} />}
              badge={
                <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                  {unreadDealerMessages || 0}
                </span>
              }
            />
            {/*<NavegationItem
            name="Services Requests"
            href="/services-requests"
            icon={<LuPyramid size={18} />}
            badge={
              <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                2
              </span>
            }
          />*/}
          </SidebarCategory>
        </section>
      </motion.aside>
    </motion.div>
  );
}

function SidebarCategory({ name, children }: CategoryProps) {
  return (
    <section className="space-y-1">
      <h2 className="text-xs font-medium text-foreground/50 mt-1">{name}</h2>
      {children}
    </section>
  );
}

// function DisabledNavigationItem(data: DisabledNavigationItemProps) {
//   return (
//     <div className="flex items-center justify-between gap-3 py-1 px-2 rounded-xl hover:bg-foreground/[0.04] min-h-[34px]">
//       <div className="flex gap-3 items-center">
//         {data.icon}
//         <span className="text-sm font-medium">{data.name}</span>
//       </div>
//       {data.badge}
//     </div>
//   );
// }

function NavegationItem(data: NavegationItemProps) {
  return (
    <ActiveLink
      activeClassName="bg-blue/[0.04] ring-blue/20 ring-1 text-blue"
      className="flex items-center justify-between gap-3 py-1 px-2 rounded-xl hover:bg-foreground/[0.04] min-h-[34px]"
      href={data.href}
      onClick={data.close}
    >
      <div className="flex gap-3 items-center">
        {data.icon}
        <span className="text-sm font-medium">{data.name}</span>
      </div>
      {data.badge}
    </ActiveLink>
  );
}

type NavegationItemProps = {
  name: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
  close: () => void;
};

// type DisabledNavigationItemProps = {
//   name: string;
//   icon: ReactNode;
//   badge?: ReactNode;
// };

type CategoryProps = {
  name: string;
  children: ReactNode;
};
