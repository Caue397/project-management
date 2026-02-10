'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import Cart from './cart';
import Profile from './profile';
import HeaderSearchBar from './header-search-bar';
import MenuMobile from './menu-mobile';

export default function Header() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const { setSearchQuery, clearSearch } = useSearch();
  // const [searchKey, setSearchKey] = useState(0);

  // useEffect(() => {
  //   if (pathname !== '/search') {
  //     clearSearch();
  //     setSearchKey((prev) => prev + 1);
  //   }
  // }, [pathname, clearSearch]);

  // const handleSearchSubmit = (query: string) => {
  //   if (query.trim()) {
  //     setSearchQuery(query);
  //     router.push('/search');
  //   }
  // };
  //

  console.log(process.env.NEXT_PUBLIC_SPARK_SITE_ID);

  return (
    <header className="w-full sticky top-0 bg-white/20 border-b border-foreground/10 py-3 px-4 flex items-center justify-between z-40">
      <MenuMobile />
      <HistoryOptions />
      <HeaderSearchBar />
      <div className="flex items-center gap-2">
        <Cart />
        <Profile />
      </div>
    </header>
  );
}

function HistoryOptions() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (!navigationHistory.includes(pathname)) {
      const newHistory = [
        ...navigationHistory.slice(0, currentIndex + 1),
        pathname,
      ];
      setNavigationHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    }
  }, [pathname]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < navigationHistory.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      setCurrentIndex(currentIndex - 1);
      router.back();
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      setCurrentIndex(currentIndex + 1);
      router.forward();
    }
  };

  return (
    <div className="lg:flex hidden items-center gap-2">
      <button
        onClick={handleBack}
        className={`p-2 rounded-xl ${
          canGoBack
            ? 'bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors'
            : 'bg-transparent text-foreground/30 cursor-not-allowed'
        }`}
        disabled={!canGoBack}
      >
        <LuArrowLeft size={18} />
      </button>

      <button
        onClick={handleForward}
        className={`p-2 rounded-xl ${
          canGoForward
            ? 'bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors'
            : 'bg-transparent text-foreground/30 cursor-not-allowed'
        }`}
        disabled={!canGoForward}
      >
        <LuArrowRight size={18} />
      </button>
    </div>
  );
}
