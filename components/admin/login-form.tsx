"use client";

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError('');
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? 'Login failed');
        }

        router.replace('/admin');
        router.refresh();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Login failed');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium text-slate-100">
          Admin Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter configured admin password"
        />
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <Button type="submit" disabled={isPending} className="w-full" variant="secondary">
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
