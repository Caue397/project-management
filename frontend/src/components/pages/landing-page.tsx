'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import {
  LuLayers,
  LuFolder,
  LuSquareCheck,
  LuArrowRight,
  LuUsers,
  LuZap,
  LuCircleCheck,
  LuMenu,
  LuX,
  LuGlobe,
  LuLanguages,
} from 'react-icons/lu';
import { cn } from '@/libs/merge-classname';
import Button from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('landing');
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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Image src="/pm-icon.svg" alt="Project Management" width={32} height={32} />
          <span className="font-bold tracking-tight">Project Management</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3">
          <Dropdown
            options={localeOptions}
            value={currentLocale}
            onChange={handleLanguageChange}
            icon={<LuLanguages size={15} />}
            className="w-40"
          />
          <Link href="/sign-in">
            <Button variant="secondary" className='h-10' size="sm">{t('nav.signIn')}</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="primary" className='h-10' size="sm">{t('nav.signUp')}</Button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-xl text-foreground/60 hover:bg-foreground/[0.04] transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {open ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="sm:hidden overflow-hidden border-t border-foreground/10"
      >
        <nav className="flex flex-col gap-2 px-6 py-4">
          <Dropdown
            options={localeOptions}
            value={currentLocale}
            onChange={handleLanguageChange}
            icon={<LuGlobe size={15} />}
          />
          <Link href="/sign-in" onClick={() => setOpen(false)}>
            <Button variant="secondary" size="md" className="w-full">{t('nav.signIn')}</Button>
          </Link>
          <Link href="/sign-up" onClick={() => setOpen(false)}>
            <Button variant="primary" size="md" className="w-full">{t('nav.signUp')}</Button>
          </Link>
        </nav>
      </motion.div>
    </header>
  );
}

function HeroSection() {
  const t = useTranslations('landing');

  return (
    <section className="py-14 lg:py-36 px-4 sm:px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium bg-primary/[0.08] text-primary px-3 py-1.5 rounded-full">
            <LuZap size={12} />
            {t('hero.badge')}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6"
        >
          {t('hero.heading')}{' '}
          <span className="text-primary">{t('hero.headingHighlight')}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-base lg:text-lg text-foreground/60 leading-relaxed max-w-xl mx-auto mb-10"
        >
          {t('hero.subheading')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/sign-up">
            <Button variant="primary" size="lg">
              {t('hero.cta')}
              <LuArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="secondary" size="lg">{t('hero.ctaSecondary')}</Button>
          </Link>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-xs text-foreground/40 flex items-center justify-center gap-1.5"
        >
          <LuUsers size={13} />
          {t('hero.disclaimer')}
        </motion.p>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const t = useTranslations('landing');

  const features = [
    {
      icon: <LuLayers size={22} />,
      title: t('features.workspace.title'),
      description: t('features.workspace.description'),
      color: 'bg-primary/[0.08] text-primary',
    },
    {
      icon: <LuFolder size={22} />,
      title: t('features.projects.title'),
      description: t('features.projects.description'),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <LuSquareCheck size={22} />,
      title: t('features.issues.title'),
      description: t('features.issues.description'),
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium text-foreground/50 uppercase tracking-widest mb-3"
          >
            {t('features.label')}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight"
          >
            {t('features.heading')}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-foreground/10 p-6 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center mb-5',
                  feature.color
                )}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const t = useTranslations('landing');

  const steps = [
    {
      step: '01',
      icon: <LuUsers size={20} />,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      step: '02',
      icon: <LuFolder size={20} />,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      step: '03',
      icon: <LuCircleCheck size={20} />,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-white border-y border-foreground/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium text-foreground/50 uppercase tracking-widest mb-3"
          >
            {t('howItWorks.label')}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight"
          >
            {t('howItWorks.heading')}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="hidden md:block absolute top-8 left-[16.666%] right-[16.666%] h-px bg-foreground/10 z-0" />

          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#F0ECF5] border border-foreground/10 flex items-center justify-center text-primary">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-[200px]">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const t = useTranslations('landing');

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-background">
      <motion.div
        className="max-w-3xl mx-auto bg-primary rounded-2xl p-6 sm:p-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
          {t('finalCta.heading')}
        </h2>
        <p className="text-white/70 text-base mb-10 max-w-sm mx-auto leading-relaxed">
          {t('finalCta.subheading')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/sign-up">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-white/20"
            >
              {t('finalCta.cta')}
              <LuArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              {t('finalCta.ctaSecondary')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function LandingFooter() {
  const t = useTranslations('landing');

  return (
    <footer className="bg-white border-t border-foreground/10 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary">
          <LuLayers size={16} />
          <span className="font-bold text-sm">Project Management</span>
        </div>
        <nav className="flex items-center gap-5">
          <Link
            href="/sign-in"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            {t('nav.signIn')}
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            {t('nav.signUp')}
          </Link>
          <Link
            href="/terms"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            {t('nav.terms')}
          </Link>
        </nav>
        <p className="text-xs text-foreground/40">
          © {new Date().getFullYear()} Project Management MVP
        </p>
      </div>
    </footer>
  );
}
