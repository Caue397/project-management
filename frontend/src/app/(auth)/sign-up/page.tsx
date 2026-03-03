'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { SignUpForm, signUpSchema } from '@/schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LuMail, LuLock, LuUser } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

export default function SignUpPage() {
  const router = useRouter();
  const tTerms = useTranslations('terms');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const { loading, exec } = usePromiseStatus(
    async (data: Omit<SignUpForm, 'confirmPassword'>) => {
      await network.post('/auth/sign-up', data);
      router.push('/sign-in?registered=true');
    }
  );

  function onSubmit({ confirmPassword: _, ...body }: SignUpForm) {
    exec(body);
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-foreground/10 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Comece a gerenciar seus projetos
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            icon={<LuUser size={18} />}
            error={errors.name?.message}
            {...register('name')}
          />

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

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="********"
            icon={<LuLock size={18} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
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
          Ja tem uma conta?{' '}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Fazer login &rarr;
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
