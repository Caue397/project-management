import {
  Dialog,
  DialogContent,
  DialogHead,
  DialogBody,
  DialogFooter,
} from '../dialog.model';
import { CommonButton } from '@hale/components';
import { ReactNode } from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  close: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  confirmButtonVariant?: 'default' | 'destructive' | 'success';
  icon?: ReactNode;
  loading?: boolean;
};

export default function ConfirmationDialog({
  open,
  close,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmButtonVariant = 'default',
  icon,
  loading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      close();
    }
  };

  const getButtonState = (variant: string): 'default' | 'success' | 'error' => {
    switch (variant) {
      case 'destructive':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} close={close}>
      <DialogContent insideClassName="max-w-md mx-4">
        <DialogHead className="flex items-center gap-3">
          {icon && <div className="p-3 rounded-full bg-white">{icon}</div>}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </DialogHead>

        <DialogBody>
          <div className="text-gray-600 leading-5">
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-center gap-3">
          <CommonButton
            type="button"
            onClick={close}
            disabled={loading}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </CommonButton>

          <CommonButton
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            loading={loading}
            state={getButtonState(confirmButtonVariant)}
          >
            {confirmText}
          </CommonButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
