import { ApiResponse } from '@anibot/shared';

export function getUserId(): string {
  let userId = localStorage.getItem('anibot_user_id');
  if (!userId) {
    userId = `usr_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    localStorage.setItem('anibot_user_id', userId);
  }
  return userId;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const userId = getUserId();
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...(options.headers || {}),
  };

  const response = await fetch(endpoint, { ...options, headers });
  const json: ApiResponse<T> = await response.json();

  if (!response.ok || 'error' in json) {
    const errorMsg = 'error' in json ? json.error.message : 'API Request Failed';
    throw new Error(errorMsg);
  }

  return (json as { data: T }).data;
}
