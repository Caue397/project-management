'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { getApiErrorMessage } from '@/libs/api-error';
import { isAxiosError } from 'axios';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { SignInForm, signInSchema } from '@/schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LuMail, LuLock } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tTerms = useTranslations('terms');
  const registered = searchParams.get('registered') === 'true';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { loading, exec } = usePromiseStatus(async (data: SignInForm) => {
    await network.post('/auth/sign-in', data);
    router.push('/workspace');
  });

  async function onSubmit(data: SignInForm) {
    try {
      await exec(data);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.status === 401
          ? 'Email ou senha inválidos.'
          : getApiErrorMessage(error);
      setError('root', { message });
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-foreground/10 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Log in</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Continue para o Project Management
          </p>
        </div>

        <AnimatePresence>
          {registered && (
            <motion.p
              className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4"
              initial={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
            >
              Conta criada com sucesso! Faça login para continuar.
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            icon={<LuMail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="********"
            icon={<LuLock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <AnimatePresence>
            {errors.root?.message && (
              <motion.p
                className="text-sm text-red-500"
                initial={{ opacity: 0, height: 0, y: -4, filter: 'blur(4px)' }}
                animate={{ opacity: 1, height: 'auto', y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, height: 0, y: -4, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}
              >
                {errors.root.message}
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-foreground/50">Ou</span>
          </div>
        </div>

        <p className="text-sm text-foreground/70">
          Nao tem uma conta?{' '}
          <Link
            href="/sign-up"
            className="text-primary font-medium hover:underline"
          >
            Criar conta &rarr;
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-foreground/10 flex items-center justify-center text-xs text-foreground/40">
          <Link href="/terms" className="hover:text-foreground/60">
            {tTerms('title')}
          </Link>
        </div>
      </div>
    </main>
  );
}
