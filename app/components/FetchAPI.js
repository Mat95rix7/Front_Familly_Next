// Récupération de l'URL de l'API depuis les variables d'environnement Next.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log(`[GENEALOGIE] URL de base de l'API: ${API_BASE}`);

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

export async function apiFetch(path, options = {}) {
  try {
    console.log('[GENEALOGIE] Chemin fourni:', path);
    
    // Nettoie le chemin pour s'assurer qu'il commence par '/'
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    console.log('[GENEALOGIE] Chemin nettoyé:', cleanPath);
    
    // Construction de l'URL complète
    const url = `${API_BASE}/api${cleanPath}`;
    console.log('[GENEALOGIE] URL finale construite:', url);
    
    // Récupération du token depuis localStorage (côté client uniquement)
    const token = getStoredToken();
    const headers = {
      // 'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    console.log('[GENEALOGIE] En-têtes de la requête:', headers);
    
    // Envoie de la requête
    const response = await fetch(url, { ...options, headers });
    console.log('[GENEALOGIE] Status:', response.status);
    
    // Vérification si la réponse est OK
    if (!response.ok) {
      console.error('[GENEALOGIE] Status:', response.status);
      
      // Gestion spécifique des erreurs d'authentification
      if (response.status === 401) {
        removeStoredToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('[GENEALOGIE] Requête API réussie');
    return response;
    
  } catch (error) {
    console.error('[GENEALOGIE] Erreur lors de la requête API');
    console.error('[GENEALOGIE] Type d\'erreur:', error.name);
    console.error('[GENEALOGIE] Message d\'erreur:', error.message);
    console.error('[GENEALOGIE] Stack trace:', error.stack);
    console.error('[GENEALOGIE] URL tentée:', `${API_BASE}/api${path.startsWith('/') ? path : `/${path}`}`);
    console.error('[GENEALOGIE] Options utilisées:', options);
    
    // Re-lance l'erreur pour que l'appelant puisse la gérer
    throw error;
  }
}

// Fonctions utilitaires pour l'authentification
export function saveAuthToken(token) {
  setStoredToken(token);
}

export function getAuthToken() {
  return getStoredToken();
}

export function clearAuthToken() {
  removeStoredToken();
}

// URL de base pour les photos
export const PHOTO_BASE_URL = `${API_BASE}/uploads/photos`;

export function getPhotoUrl(photo) {
  return `${PHOTO_BASE_URL}/${photo || 'default.png'}`;
}

// Fonctions utilitaires spécifiques pour les API courantes
export async function apiGet(path) {
  const response = await apiFetch(path, { method: 'GET' });
  return response.json();
}

export async function apiPost(path, data) {
  const response = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiPut(path, data) {
  const response = await apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiDelete(path) {
  const response = await apiFetch(path, { method: 'DELETE' });
  return response.ok;
}

// Fonction pour uploader des fichiers (photos)
export async function apiUploadFile(path, formData) {
  const token = getStoredToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
  };

  const url = `${API_BASE}/api${path.startsWith('/') ? path : `/${path}`}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}