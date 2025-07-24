import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type TokenPayload = {
  id: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
};

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (e) {
        console.error('Token invalide', e);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  return role;
}
