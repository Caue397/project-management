'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  LuArrowLeft,
  LuShield,
  LuFileText,
  LuLanguages,
  LuLayers,
  LuCalendar,
} from 'react-icons/lu';
import Dropdown from '@/components/ui/dropdown';
import { cn } from '@/libs/merge-classname';

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const;

type Section = 'tos' | 'privacy';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TermsNav />
      <PageHero />
      <PageContent />
      <TermsFooter />
    </div>
  );
}

function TermsNav() {
  const t = useTranslations('terms');
  const tLocales = useTranslations('locales');
  const currentLocale = useLocale();
  const router = useRouter();

  const localeOptions = SUPPORTED_LOCALES.map((locale) => ({
    value: locale,
    label: tLocales(locale),
  }));

  function handleLanguageChange(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-foreground/10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary shrink-0">
          <Image src="/pm-icon.svg" alt="Project Management" width={28} height={28} />
          <span className="font-bold text-sm tracking-tight hidden sm:inline">Project Management</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <Dropdown
            options={localeOptions}
            value={currentLocale}
            onChange={handleLanguageChange}
            icon={<LuLanguages size={15} />}
            className="w-40"
          />
        </div>
      </div>
    </header>
  );
}

function PageHero() {
  const t = useTranslations('terms');

  return (
    <div className="bg-white border-b border-foreground/10 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap"
        >
          <LuArrowLeft size={15} />
          <span className="hidden sm:inline">{t('nav.backToHome')}</span>
        </Link>
        <h1 className="text-3xl mt-2 font-bold text-foreground tracking-tight">{t('title')}</h1>
        <p className="text-foreground/60 mt-2 text-sm">{t('subtitle')}</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-foreground/40 mt-3">
          <LuCalendar size={12} />
          {t('lastUpdated')}
        </span>
      </div>
    </div>
  );
}

function PageContent() {
  const t = useTranslations('terms');
  const [activeSection, setActiveSection] = useState<Section>('tos');
  const tosRef = useRef<HTMLElement>(null);
  const privacyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as Section);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    if (tosRef.current) observer.observe(tosRef.current);
    if (privacyRef.current) observer.observe(privacyRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Anchor nav */}
      <div className="flex gap-2 mb-8 p-1 bg-white rounded-xl border border-foreground/10 w-fit">
        <a
          href="#tos"
          onClick={() => setActiveSection('tos')}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            activeSection === 'tos'
              ? 'bg-primary text-white shadow-sm'
              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04]',
          )}
        >
          <LuFileText size={14} />
          {t('nav.tos')}
        </a>
        <a
          href="#privacy"
          onClick={() => setActiveSection('privacy')}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            activeSection === 'privacy'
              ? 'bg-primary text-white shadow-sm'
              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04]',
          )}
        >
          <LuShield size={14} />
          {t('nav.privacy')}
        </a>
      </div>

      {/* Terms of Service */}
      <section ref={tosRef} id="tos" className="bg-white rounded-2xl border border-foreground/10 p-6 sm:p-8 mb-6 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
          <div className="w-9 h-9 rounded-xl bg-primary/[0.08] text-primary flex items-center justify-center shrink-0">
            <LuFileText size={18} />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('tos.title')}</h2>
        </div>
        <div className="space-y-6">
          {(
            ['acceptance', 'service', 'account', 'use', 'ip', 'termination', 'liability', 'changes'] as const
          ).map((key) => (
            <div key={key}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1.5">
                {t(`tos.${key}.title`)}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{t(`tos.${key}.content`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Policy */}
      <section ref={privacyRef} id="privacy" className="bg-white rounded-2xl border border-foreground/10 p-6 sm:p-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
          <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <LuShield size={18} />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('privacy.title')}</h2>
        </div>
        <div className="space-y-6">
          {(
            ['collection', 'use', 'storage', 'sharing', 'rights', 'cookies', 'changes', 'contact'] as const
          ).map((key) => (
            <div key={key}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1.5">
                {t(`privacy.${key}.title`)}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{t(`privacy.${key}.content`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TermsFooter() {
  return (
    <footer className="bg-white border-t border-foreground/10 py-6 px-4 sm:px-6 mt-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary">
          <LuLayers size={16} />
          <span className="font-bold text-sm">Project Management</span>
        </div>
        <p className="text-xs text-foreground/40">
          © {new Date().getFullYear()} Project Management MVP
        </p>
      </div>
    </footer>
  );
}
