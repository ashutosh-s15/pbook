'use client';

import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export function showToast({
  type,
  title,
  description,
  options,
}: {
  type: ToastType;
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}) {
  sonnerToast(title, {
    description,
    type,
    ...options,
  });
}
