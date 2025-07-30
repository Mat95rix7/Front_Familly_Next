// components/ProtectedPage.js
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedPage({ children, requiredRole = null }) {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
      router.replace('/');
    }
  }, [user, router, requiredRole, role]);

  if (!user) return null; 
  if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) return null;

  return children;
}
