'use client';

import { cartQuery } from '@/network/queries/cart.query';
import {
  cartAmountMutation,
  deleteItemCartMutation,
  payCartMutation,
} from '@/network/mutations/cart.mutation';
import { companyAddressesQuery } from '@/network/queries/company.query';
import { productsQuery } from '@/network/queries/product.query';
import { cn, CommonButton } from '@hale/components';
import { Address, Item } from '@hale/postgres/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  LuDollarSign,
  LuMinus,
  LuPlus,
  LuSearch,
  LuStore,
  LuTriangleAlert,
  LuX,
} from 'react-icons/lu';
import Image from 'next/image';
import Input from '../input';
import { useClickAway, useDebounce } from '@uidotdev/usehooks';
import { GetAllProductsQuery } from '@hale/shopify/storefront';
import { toast } from '@/lib/toast';

export default function CartDrawer({ close }: { close: () => void }) {
  const { data: cart } = cartQuery();
  const { data: products } = productsQuery();
  const { data: addresses } = companyAddressesQuery();
  const { mutateAsync: pay, isPending } = payCartMutation();

  const [address, setAddress] = useState<Address | null>(null);
  const [search, setSearch] = useState('');
  const interactive = useClickAway<HTMLDivElement>(() => close());

  function total() {
    if (!cart?.items || !products?.products.nodes) return 0;

    return cart.items
      .map((item) => {
        const variant = products.products.nodes
          .find((product) => product.id === item.productId)
          ?.variants.edges.find((v) => v.node.id === item.variantId)?.node;

        const price = Number(variant?.price?.amount ?? 0);
        return price * item.quantity;
      })
      .reduce((acc, item) => acc + item, 0);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-40 fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-end"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        ref={interactive}
        className="h-full bg-white max-w-md rounded-l-2xl p-5 flex flex-col whitespace-nowrap"
      >
        <div className="flex items-center gap-4 whitespace-nowrap justify-between">
          <div className="my-2">
            <h2 className="font-medium">Purchase Cart</h2>
            <p className="text-sm text-foreground/60">
              Add items to your order
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full bg-foreground/[0.02] border border-foreground/20"
          >
            <LuX size={18} />
          </button>
        </div>

        <div className="my-3">
          <Input
            icon={<LuSearch size={20} />}
            placeholder="Search for a product"
            wrapperClassName="bg-foreground/[0.02]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            keybinds={[
              { bind: 'CTRL', key: 'CTRL' },
              { bind: 'L', key: 'L' },
            ]}
          />
        </div>

        <h2 className="text-xs font-medium text-foreground/50 my-1">
          Products
        </h2>

        <div className="w-full flex flex-col flex-1 overflow-y-auto pr-3">
          <ProductsView search={search} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-medium text-foreground/50 mt-2 mb-1">
            Ship to
          </h2>

          {addresses && addresses.length === 0 && (
            <p className="text-xs font-medium ml-2 text-red-400 inline-flex items-center gap-2">
              <LuTriangleAlert size={15} />
              No addresses found
            </p>
          )}
          {addresses?.map((location, key) => (
            <AddressCard
              key={key}
              address={location}
              onSelect={setAddress}
              selected={address?.id}
            />
          ))}
        </div>

        <hr className="border-foreground/20 border-dashed my-5" />

        <div className="mb-5 text-sm font-medium">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground/50">Total</h2>
            <p className="text-foreground">{formatPrice(total(), 'USD')}</p>
          </div>
        </div>

        <CommonButton
          disabled={!address || !cart?.items || cart.items.length === 0}
          loading={isPending}
          onClick={async () => {
            const draft = await pay({
              addressId: address.id,
            });

            const checkout = draft.data?.draftOrderCreate.draftOrder;

            if (checkout?.invoiceUrl) {
              window.open(checkout.invoiceUrl, '_blank');
              // window.open(`/orders/teste`, '_self');
            }
          }}
          icon={<LuDollarSign size={18} />}
        >
          Go to checkout
        </CommonButton>
      </motion.div>
    </motion.div>
  );
}

function ProductsView({ search }: { search: string }) {
  const { data: cart, isLoading: loadingSession } = cartQuery();
  const { data: products, isLoading: loadingProducts } = productsQuery();

  if (loadingSession || loadingProducts)
    return (
      <div className="space-y-2">
        {Array.from({ length: cart?.items?.length ?? 0 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );

  if (!cart?.items) return null;

  return (
    <div className="space-y-2.5 w-full">
      <AnimatePresence>
        {cart?.items
          ?.map((item) => ({
            product: products?.products.nodes.find(
              (product) => product.id === item.productId
            ),
            cartItem: item,
          }))
          .filter((data) => data.product)
          .filter((data) =>
            data.product?.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((data) => (
            <ProductCard
              key={data.cartItem.id}
              product={data.product}
              item={data.cartItem}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, item }: CardProps) {
  const [amount, setAmount] = useState(String(item.quantity));
  const updateAmount = cartAmountMutation();
  const { mutateAsync: deleteItem } = deleteItemCartMutation();
  const debouncedAmount = useDebounce(amount, 700);
  const firstRender = useRef(true);
  const isManualUpdate = useRef(false);

  const variant = product?.variants.edges?.find(
    (v) => v.node.id === item.variantId
  )?.node;
  const image = variant.image?.url || product?.images.nodes[0]?.url;

  // Sincroniza amount quando item.quantity mudar externamente (sem disparar mutation)
  useEffect(() => {
    if (!isManualUpdate.current) {
      setAmount(String(item.quantity));
    }
    isManualUpdate.current = false;
  }, [item.quantity]);

  // Effect do debounce - só dispara para mudanças manuais
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (debouncedAmount.trim().length === 0) return;

    const num = Number(debouncedAmount);
    if (isNaN(num) || num <= 0) return;

    // Só envia se for diferente da quantidade atual
    if (num !== item.quantity) {
      updateAmount.mutate({
        itemId: item.id.toString(),
        variantId: item.variantId,
        action: 'manual',
        amount: debouncedAmount,
      });
    }
  }, [debouncedAmount]);

  const handleDeleteItem = async () => {
    try {
      await deleteItem({
        itemId: item.id.toString(),
      });
    } catch (e) {
      toast.error('Unable to delete item from cart');
    }
  };

  const handleAmountChange = (action: 'increment' | 'decrement') => {
    isManualUpdate.current = true;
    const currentAmount = Number(amount);

    if (action === 'increment') {
      setAmount(String(currentAmount + 1));
    } else if (action === 'decrement' && currentAmount > 1) {
      setAmount(String(currentAmount - 1));
    }

    updateAmount.mutate({
      itemId: item.id.toString(),
      variantId: item.variantId,
      action,
    });
  };

  return (
    <motion.div
      key={item.id}
      exit={{ opacity: 0, x: 10, filter: 'blur(20px)' }}
      layout
      className="flex items-center gap-2 justify-between flex-1"
    >
      <div className="flex items-center gap-3">
        <div className="bg-foreground/[0.04] rounded-xl p-2">
          <Image
            src={image}
            alt={product?.title}
            width={54}
            height={54}
            quality={100}
            className="object-cover rounded-md min-w-14 min-h-14"
          />
        </div>
        <div>
          <h1 className="font-medium max-w-[220px] truncate">
            {product?.title}
          </h1>
          <p className="text-wrap font-medium text-xs text-foreground/70">
            {variant.title}
          </p>
          <p className="text-sm text-foreground/50">
            {formatPrice(
              variant?.price?.amount ?? 0,
              variant?.price?.currencyCode ?? 'USD'
            )}{' '}
            {variant?.sku && `─ ${variant?.sku}`}
          </p>
          <button
            onClick={handleDeleteItem}
            className="text-xs font-medium text-blue hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleAmountChange('decrement')}
          disabled={updateAmount.isPending || Number(amount) <= 1}
          className="p-0.5 rounded-full bg-foreground/[0.02] border border-foreground/20 disabled:opacity-50"
        >
          <LuMinus size={12} />
        </button>
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setAmount('');
              isManualUpdate.current = true;
              return;
            }
            if (!/^\d+$/.test(value)) return;
            setAmount(value);
            isManualUpdate.current = true;
          }}
          onBlur={() => {
            if (amount === '' || Number(amount) < 1) {
              setAmount(String(item.quantity));
              isManualUpdate.current = false;
            }
          }}
          className="w-7 text-center rounded-sm focus:outline-none focus:ring-1 ring-offset-2 focus:ring-blue/40 outline-none bg-transparent"
        />
        <button
          onClick={() => handleAmountChange('increment')}
          disabled={updateAmount.isPending}
          className="p-0.5 rounded-full bg-foreground/[0.02] border border-foreground/20 disabled:opacity-50"
        >
          <LuPlus size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function AddressCard({ address, onSelect, selected }: AddressProps) {
  const disabled = address == null;

  return (
    <div
      className={cn(
        'p-2 rounded-xl border cursor-pointer border-foreground/10 text-sm',
        'bg-foreground/[0.02] flex items-center gap-3',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onSelect(address)}
    >
      <input
        type="radio"
        name="address"
        className="w-4 h-4 accent-blue cursor-pointer"
        disabled={disabled}
        checked={address.id === selected}
        onChange={() => onSelect(address)}
      />
      <LuStore size={18} />
      <div>
        <h1 className="font-medium">{address.name}</h1>
        <p className="text-foreground/50 font-medium text-xs">
          {disabled
            ? 'No shipping address valid'
            : `${address.address1} ${address.address2}`}
        </p>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return <div></div>;
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

type CardProps = { product: Product; item: Item };
type AddressProps = {
  address: Address;
  onSelect: (address: Address) => void;
  selected: number;
};

type Product = GetAllProductsQuery['products']['nodes'][0];
