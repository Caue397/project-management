'use client';

import { ReactNode } from 'react';
import {
  LuArchive,
  LuFiles,
  LuInbox,
  LuLayers,
  LuMessageSquare,
  LuSettings2,
  // LuColumns3,
} from 'react-icons/lu';
import ActiveLink from '../../active-link';
import { countOrders } from '@/network/queries/draft-order.query';
import HaleLogo from '+/hale_logo.svg';
import Image from 'next/image';
import { unreadMessagesQuery } from '@/network/queries/chat.query';
import { countDealerMessagesQuery } from '@/network/queries/dealer-message.query';

export default function Sidebar() {
  // const { data: products } = productsQuery();
  const { data: orders } = countOrders();
  const { data: unreadMessages } = unreadMessagesQuery();
  const { data: unreadDealerMessages } = countDealerMessagesQuery();

  return (
    <aside className="lg:block hidden max-w-[280px] w-full bg-white/20 border-r border-foreground/10 h-screen p-4 space-y-10">
      <Image src={HaleLogo} alt="Hale Logo" width={110} height={40} />

      <section className="space-y-5">
        <SidebarCategory name="Overview">
          <NavegationItem
            name="Orders"
            href="/orders"
            icon={<LuFiles size={18} />}
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
            badge={
              <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
                  {unreadMessages || 0}
              </span>
            }
          />
        </SidebarCategory>

        <SidebarCategory name="Dealer">
          <NavegationItem
            name="Dealer Store"
            href="/dealer-store"
            icon={<LuArchive size={18} />}
            // badge={
            //   products && (
            //     <span className="text-xs bg-white border border-foreground/10 px-2.5 py-1 rounded-lg font-medium">
            //       {products.products.nodes.length}
            //     </span>
            //   )
            // }
          />

          {/*<NavegationItem
            name="Custom Order"
            href="/custom-order"
            icon={<LuColumns3 size={18} />}
          />*/}

          <NavegationItem
            name="Settings"
            href="/settings"
            icon={<LuSettings2 size={18} />}
          />

          <NavegationItem
            name="Resources"
            href="/resources"
            icon={<LuLayers size={18} />}
          />
        </SidebarCategory>

        <SidebarCategory name="Operational">
          <NavegationItem
            name="Inbox"
            href="/inbox"
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
    </aside>
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
