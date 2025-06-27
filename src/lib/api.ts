/**
 * Erreur personnalisée pour les réponses API non-OK.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Un client fetch() encapsulé pour interagir avec l'API backend.
 *
 * Caractéristiques :
 * - Ajoute automatiquement le header 'Content-Type: application/json'.
 * - Récupère le token JWT depuis le localStorage et l'ajoute au header 'Authorization'.
 * - Gère les URLs relatives et absolues en se basant sur NEXT_PUBLIC_API_URL.
 * - Lance une ApiError si la réponse du serveur n'est pas ok (status 2xx).
 */
const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;

  // Récupération du token depuis le localStorage.
  // Note : cela ne fonctionnera que côté client.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    // Tenter de lire le corps de la réponse pour un message d'erreur plus détaillé
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorMessage;
    } catch (e) {
        // Le corps de l'erreur n'est pas du JSON ou est vide
    }
    throw new ApiError(errorMessage, response.status, response.statusText);
  }

  // Si le body est vide (ex: réponse 204 No Content), on ne tente pas de le parser
  if (response.status === 204) {
      return undefined as T;
  }

  return response.json() as Promise<T>;
};

export default apiClient; 