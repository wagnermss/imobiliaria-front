import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string>;
}

export function extractApiErrorPayload(error: unknown): ApiErrorPayload {
  if (
    !(error instanceof HttpErrorResponse) ||
    typeof error.error !== 'object' ||
    error.error === null ||
    Array.isArray(error.error)
  ) {
    return {};
  }

  const payload = error.error as {
    message?: unknown;
    errors?: unknown;
  };

  return {
    message:
      typeof payload.message === 'string' && payload.message.trim()
        ? payload.message
        : undefined,
    errors: isStringRecord(payload.errors) ? payload.errors : undefined
  };
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  const ddd = digits.slice(0, 2);
  const middle = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const last = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (!last) {
    return `(${ddd})${middle}`;
  }

  return `(${ddd})${middle}-${last}`;
}

export function formatCurrencyInput(value: string | number): string {
  if (typeof value === 'number') {
    return Number.isFinite(value)
      ? new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value)
      : '';
  }

  const digits = onlyDigits(value);
  if (!digits) {
    return '';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(digits) / 100);
}

export function parseCurrencyInput(value: string): number | null {
  const digits = onlyDigits(value);
  if (!digits) {
    return null;
  }

  return Number(digits) / 100;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'string')
  );
}
