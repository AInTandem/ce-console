/**
 * Runtime configuration utility
 * Provides access to environment variables that can be set at runtime
 */

declare global {
  interface Window {
    __KAI_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

/**
 * Get the API base URL
 *
 * Modes:
 * - Empty string (default) → Proxy mode, use relative paths
 * - Explicit URL → Direct mode, use absolute URLs
 *
 * Priority:
 * 1. Runtime config (window.__KAI_CONFIG__.apiBaseUrl) - set by container entrypoint
 * 2. Build-time env (VITE_API_BASE_URL) - for custom builds
 * 3. Empty string - proxy mode (default)
 */
export function getApiBaseUrl(): string {
  const runtimeConfig = window.__KAI_CONFIG__?.apiBaseUrl;
  const buildTimeConfig = import.meta.env.VITE_API_BASE_URL;

  // Explicit empty string or undefined means "use proxy mode"
  if (runtimeConfig === '' || buildTimeConfig === '') {
    return '';
  }

  return runtimeConfig || buildTimeConfig || '';
}

/**
 * Get full URL for external resources (iframes, window.open, links)
 */
export function getExternalResourceUrl(path: string): string {
  const apiBase = getApiBaseUrl();

  if (apiBase) {
    // Direct mode: use configured backend URL
    return `${apiBase}${path}`;
  }

  // Proxy mode: use current origin
  return `${window.location.origin}${path}`;
}

/**
 * Build URL for API calls
 */
export function buildApiUrl(path: string): string {
  const apiBase = getApiBaseUrl();

  if (apiBase) {
    // Direct mode: absolute URL
    return `${apiBase}${path}`;
  }

  // Proxy mode: relative path (let browser/proxy handle)
  return path;
}
