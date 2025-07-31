// Récupération de l'URL de l'API depuis les variables d'environnement Next.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Fonction utilitaire pour gérer le localStorage côté client uniquement
function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setStoredToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

function removeStoredToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

// Fonction pour envoyer des requêtes vers l'API
export async function apiFetch(path, options = {}) {
  try {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${API_BASE}/api${cleanPath}`;
    const token = getStoredToken();
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers });
    // if (!response.ok) {
    //   if (response.status === 401) {
    //     removeStoredToken();
    //     if (typeof window !== 'undefined') {
    //       window.location.href = '/';
    //     }
    //   }
    //   throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    // }
    return response;
    
  } catch (error) {
      throw error;
  }
}

export function getPhotoUrl(photoUrl) {
  return photoUrl || 'https://ik.imagekit.io/csooo1xpoo/users/default.png';
}