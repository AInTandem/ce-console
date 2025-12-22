import apiClient from './client';

// Container Management
export const listContainers = () => apiClient.GET('/api/flexy');
export const createContainer = (body: any) => apiClient.POST('/api/flexy', { body });
export const startContainer = (id: string) => apiClient.POST('/api/flexy/{id}/start', { params: { path: { id } } });
export const stopContainer = (id: string) => apiClient.POST('/api/flexy/{id}/stop', { params: { path: { id } } });
export const deleteContainer = (id: string) => apiClient.DELETE('/api/flexy/{id}', { params: { path: { id } } });

// Host Management
export const listHostDirectories = (body: any) => apiClient.POST('/api/host/directories', { body });

// Health Check
export const getHealth = () => apiClient.GET('/api/health');
