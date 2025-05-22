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
  options?: any;
}) {
  sonnerToast(title, {
    description,
    type,
    ...options,
  });
}
