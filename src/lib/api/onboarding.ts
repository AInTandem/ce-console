/**
 * Onboarding API Client
 * Functions for handling system onboarding process
 */

import { buildApiUrl } from '../config';
import { electronApiProxy } from '../utils/authenticated-fetch';
import {
  OnboardingStatus,
  CreateAdminRequest,
  JwtSecretsResponse,
  SetSystemNameRequest
} from '../../types/onboarding';

/**
 * Get current onboarding status
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const fetchMethod = window.__IN_AINTANDEM_DESKTOP__ ? electronApiProxy : fetch;
  const response = await fetchMethod(buildApiUrl('/api/onboarding/status'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Create admin account
 */
export async function createAdminAccount(data: CreateAdminRequest): Promise<{ success: boolean; message?: string }> {
  const fetchMethod = window.__IN_AINTANDEM_DESKTOP__ ? electronApiProxy : fetch;
  const response = await fetchMethod(buildApiUrl('/api/onboarding/step1'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create admin account');
  }

  return await response.json();
}

/**
 * Generate JWT secrets
 */
export async function generateJwtSecrets(): Promise<JwtSecretsResponse> {
  const fetchMethod = window.__IN_AINTANDEM_DESKTOP__ ? electronApiProxy : fetch;
  const response = await fetchMethod(buildApiUrl('/api/onboarding/step2'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate JWT secrets');
  }

  return await response.json();
}

/**
 * Set system name
 */
export async function setSystemName(data: SetSystemNameRequest): Promise<{ success: boolean; message?: string }> {
  const fetchMethod = window.__IN_AINTANDEM_DESKTOP__ ? electronApiProxy : fetch;
  const response = await fetchMethod(buildApiUrl('/api/onboarding/step3'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to set system name');
  }

  return await response.json();
}

/**
 * Complete onboarding process
 */
export async function completeOnboarding(): Promise<{ success: boolean; message?: string }> {
  const fetchMethod = window.__IN_AINTANDEM_DESKTOP__ ? electronApiProxy : fetch;
  const response = await fetchMethod(buildApiUrl('/api/onboarding/complete'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to complete onboarding');
  }

  return await response.json();
}
