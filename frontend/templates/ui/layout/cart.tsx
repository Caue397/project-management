'use client';

import { useEffect, useState } from 'react';
// import { AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
// import CartDrawer from './cart.drawer';
// import { cartQuery } from '@/network/queries/cart.query';

export default function Cart() {
  // const [open, setOpen] = useState(false);
  // const { data } = cartQuery();
  const [items, setItems] = useState<any[]>([]);
  const [sparkReady, setSparkReady] = useState(false);

  const loadCart = async () => {
    if (typeof window === 'undefined' || !window?.spark) return;
    const cart = await window.spark?.getCart();
    setItems(cart?.products ?? []);
    console.log('Cart loaded:', { items });
  };

  useEffect(() => {
    // Verificar se estamos no cliente antes de acessar window
    if (typeof window === 'undefined') return undefined;

    // Carregar imediatamente se o Spark já estiver disponível
    if (window.spark) {
      setSparkReady(true);
      loadCart();
      return undefined;
    }

    // Caso contrário, verificar periodicamente até o Spark estar disponível
    const checkSpark = setInterval(() => {
      if (window.spark) {
        setSparkReady(true);
        loadCart();
        clearInterval(checkSpark);
      }
    }, 500);

    return () => clearInterval(checkSpark);
  }, []);

  // Recarregar carrinho quando Spark estiver pronto
  useEffect(() => {
    if (sparkReady) {
      loadCart();
    }
    return undefined;
  }, [sparkReady]);

  return (
    <section>
      <div className="relative">
        <button
          onClick={() => window.spark?.openDrawer('cart')}
          className="w-9 h-9 cursor-pointer rounded-xl bg-white border border-foreground/10 flex items-center justify-center"
        >
          <IoBagHandleOutline size={18} />
        </button>

        {items?.length > 0 && (
          <div
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500"
            style={{
              width: 16,
              height: 16,
            }}
          >
            <span className="text-white text-[10px] relative bottom-[0.5px] font-medium">
              {items.length}
            </span>
          </div>
        )}
      </div>
      {/*
      <AnimatePresence>
        {open && <CartDrawer close={() => setOpen(false)} />}
      </AnimatePresence>*/}
    </section>
  );
}
