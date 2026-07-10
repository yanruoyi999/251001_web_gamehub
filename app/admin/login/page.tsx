import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AdminLoginForm } from '@/components/admin/login-form';
import { assertAdminPasswordConfigured, isAdminAuthenticated } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luma Game Hub Admin Login',
};

export default async function AdminLoginPage() {
  assertAdminPasswordConfigured();

  if (await isAdminAuthenticated()) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-100">Luma Game Hub Admin</h1>
          <p className="text-sm text-slate-400">Enter the administrator password to continue.</p>
        </div>
        <AdminLoginForm />
        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="font-medium text-indigo-300 hover:text-indigo-200">
            Back to Luma Game Hub
          </Link>
        </p>
      </div>
    </div>
  );
}
