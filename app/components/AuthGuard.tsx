'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublic = pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/' || pathname === '/not-found' || pathname === '/unauthorized';

    if (!isPublic && !token) {
      router.replace('/not-found');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen dark-bg-animated">
        <div
          className="w-16 h-16 border-8 border-gray-300 border-t-8 border-t-cyan-400 rounded-full animate-spin mb-4"
          role="status"
          aria-label="Loading"
        />
        <p className="text-cyan-400 text-lg font-semibold">
          Vérification en cours...
        </p>
      </div>
    ;
  }

  return <>{children}</>;
}

