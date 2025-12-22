// Settings API functions
import { apiCall } from '@/lib/api';

export interface SettingsData {
  gitDisplayName?: string;
  gitEmail?: string;
  dockerImage?: string;
}

// Fetch user settings
export const getSettings = async (): Promise<SettingsData> => {
  return apiCall<SettingsData>('/api/settings', { method: 'GET' });
};

// Update user settings
export const updateSettings = async (settings: SettingsData): Promise<SettingsData> => {
  return apiCall<SettingsData>('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
};