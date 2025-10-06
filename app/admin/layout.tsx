import { ReactNode } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE } from '@/lib/auth/admin';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/games', label: 'Games' },
  { href: '/admin/ratings', label: 'Ratings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const session = cookies().get(ADMIN_SESSION_COOKIE);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/admin" className="text-lg font-semibold tracking-wide">
            GameHub Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium uppercase tracking-wide transition hover:bg-slate-800"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
