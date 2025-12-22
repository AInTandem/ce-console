import createClient from 'openapi-fetch';
import type { paths } from './types';
import { getApiBaseUrl } from '@/lib/config';

// 創建 API 客戶端
// If API base URL is not set, use current origin for proxy compatibility
const apiClient = createClient<paths>({
  baseUrl: getApiBaseUrl() || window.location.origin,
});

// 為每個請求添加認證頭
apiClient.use({
  async onRequest(context) {
    // Get the token from localStorage where it's stored by AuthContext
    const token = localStorage.getItem('authToken');
    if (token && context.request) {
      context.request.headers.set('Authorization', `Bearer ${token}`);
    }
    return context.request;
  }
});

export default apiClient;
