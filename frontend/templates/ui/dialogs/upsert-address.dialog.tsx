'use client';

import {
  Dialog,
  DialogContent,
  DialogHead,
  DialogBody,
  DialogBottom,
} from '../dialog.model';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { LuStore } from 'react-icons/lu';
import { CommonButton, formatPhone, SimpleInput } from '@hale/components';
import { countriesQuery, statesQuery } from '@/network/queries/locations.query';
import Select from '../select.input';
import {
  createAddressMutation,
  updateAddressMutation,
} from '@/network/mutations/dealer.mutation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { Address } from '@/network/queries/dealer.query';
import {
  CreateAddressDto,
  createAddressSchema,
} from '@/schemas/address.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function UpsertAddressDialog({
  address,
  open,
  setOpen,
  children,
}: Props) {
  const queryClient = useQueryClient();
  const [country, setCountry] = useState<number>(233);

  const {
    register,
    watch,
    handleSubmit: hookFormSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAddressDto>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      phone: '',
      company: '',
      city: '',
      province: '',
      provinceCode: '',
      country: 'United States',
      countryCode: 'US',
      zip: '',
      default: false,
    },
  });

  const { data: countries } = countriesQuery();
  const { data: states } = statesQuery();

  const currentCountry = address
    ? countries?.find((c) => c.name === address.country)
    : countries?.find((c) => c.iso2 === 'US');

  const currentStates =
    states?.find((state) => state.id === country)?.states || [];

  const currentState = currentStates.find((s) => s.name === address?.province);

  const createAddress = createAddressMutation();
  const updateAddress = updateAddressMutation();

  useEffect(() => {
    if (address) {
      reset({
        firstName: address.firstName ?? '',
        lastName: address.lastName ?? '',
        address1: address.address1 ?? '',
        address2: address.address2 ?? '',
        phone: address.phone ?? '',
        company: address.company ?? '',
        city: address.city ?? '',
        province: address.province ?? '',
        provinceCode: address.provinceCode ?? '',
        country: address.country ?? '',
        countryCode: address.countryCodeV2 ?? '',
        zip: address.zip ?? '',
        default: false,
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: CreateAddressDto) => {
    try {
      if (address) {
        const id = address.id
          .split('gid://shopify/MailingAddress/')[1]
          .split('?')[0];
        await updateAddress.mutateAsync({
          address: data,
          id,
        });
        queryClient.invalidateQueries({ queryKey: ['addresses'] });
        toast.success('Address data saved successfully');
        setOpen(false);
        return;
      }

      await createAddress.mutateAsync(data);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address created successfully');
      setOpen(false);
    } catch {
      toast.error('Unable to upload address');
    }
  };

  return (
    <Fragment>
      {children}

      <Dialog
        open={open}
        close={() => {
          setOpen(false);
          setCountry(233);
          reset();
        }}
      >
        <DialogContent insideClassName="max-w-xl">
          <DialogHead className="flex items-center gap-3">
            <LuStore size={20} />
            <div>
              <h1 className="font-medium">
                {!address ? 'Create Address' : 'Update Address'}
              </h1>
              <p className="text-xs text-foreground/60">
                {!address
                  ? 'Create a new address for your company'
                  : 'Update the address for your company'}
              </p>
            </div>
          </DialogHead>

          <DialogBody className="p-3 rounded-xl border m-5 border-foreground/10 space-y-3">
            <div className="flex items-center gap-3">
              <SimpleInput
                label="First Name"
                theme="light-outline"
                {...register('firstName')}
                error={errors.firstName?.message}
              />

              <SimpleInput
                label="Last Name"
                theme="light-outline"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>

            <SimpleInput
              label="Address Line 1"
              theme="light-outline"
              {...register('address1')}
              error={errors.address1?.message}
            />

            <SimpleInput
              label="Address Line 2 (Optional)"
              theme="light-outline"
              {...register('address2')}
            />

            <div className="flex items-center gap-3">
              <SimpleInput
                label="Company"
                theme="light-outline"
                {...register('company')}
                error={errors.company?.message}
              />

              <SimpleInput
                label="Phone"
                theme="light-outline"
                value={formatPhone(watch('phone') || '').formatted}
                onChange={(e) => {
                  const input = e.target;
                  const cursorPos = input.selectionStart ?? 0;

                  const { formatted, newCursor } = formatPhone(
                    input.value,
                    cursorPos
                  );

                  setValue('phone', formatted, { shouldValidate: true });

                  requestAnimationFrame(() => {
                    input.setSelectionRange(newCursor, newCursor);
                  });
                }}
                error={errors.phone?.message}
              />
            </div>

            <div className="flex items-center gap-3">
              <SimpleInput
                label="City"
                theme="light-outline"
                {...register('city')}
                error={errors.city?.message}
              />

              <Select
                key={country}
                label="State"
                initialValue={currentState?.id?.toString()}
                onChange={(name, _) => {
                  setValue('province', name);
                  setValue('provinceCode', name);
                }}
                options={
                  currentStates?.length
                    ? currentStates.map((s) => ({
                        label: s.name,
                        value: s.id.toString(),
                      }))
                    : [{ label: 'Loading...', value: '' }]
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                label="Country"
                initialValue={currentCountry?.id?.toString()}
                onChange={(_, value) => {
                  setCountry(Number(value));
                  const selectedCountry = countries?.find(
                    (c) => c.id === Number(value)
                  );

                  setValue('country', selectedCountry?.name || 'United States');
                  setValue('countryCode', selectedCountry?.iso2 || 'US');

                  setValue('province', '');
                  setValue('provinceCode', '');
                }}
                options={countries?.map((c) => ({
                  label: c.name,
                  value: c.id.toString(),
                }))}
              />

              <SimpleInput
                label="Zip Code"
                theme="light-outline"
                {...register('zip')}
                error={errors.zip?.message}
              />
            </div>
          </DialogBody>

          <DialogBottom>
            <CommonButton
              className="h-9"
              onClick={hookFormSubmit(onSubmit)}
              loading={
                isSubmitting ||
                updateAddress.isPending ||
                createAddress.isPending
              }
            >
              {address ? 'Update' : 'Create'}
            </CommonButton>
          </DialogBottom>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

type Props = {
  address?: Address;
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: ReactNode;
};
