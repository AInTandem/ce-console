/**
 * Centralized authenticated fetch utility
 * Provides a single source of truth for authenticated API calls
 */

// Helper function to handle unauthorized responses
export function handleUnauthorized() {
  // Clear auth data
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');

  // Redirect to login page
  window.location.href = '/login';
}

/**
 * Helper function to make authenticated API calls
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  const headers = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Check if the response is unauthorized (401) or forbidden (403)
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
  }

  return response;
}