'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Link from 'next/link';
import { LuMail, LuLock, LuUser } from 'react-icons/lu';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-foreground/10 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Comece a gerenciar seus projetos
          </p>
        </div>

        <form className="space-y-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            icon={<LuUser size={18} />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            icon={<LuMail size={18} />}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="********"
            icon={<LuLock size={18} />}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="********"
            icon={<LuLock size={18} />}
          />

          <Button type="submit" className="w-full">
            Criar conta
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
          <Link
            href="/sign-in"
            className="text-primary font-medium hover:underline"
          >
            Fazer login &rarr;
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-foreground/10 flex items-center justify-center gap-4 text-xs text-foreground/40">
          <Link href="#" className="hover:text-foreground/60">
            Ajuda
          </Link>
          <Link href="#" className="hover:text-foreground/60">
            Privacidade
          </Link>
          <Link href="#" className="hover:text-foreground/60">
            Termos
          </Link>
        </div>
      </div>
    </main>
  );
}
