export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function handleApiResponse<T>(responsePromise: Promise<{ data?: T; error?: any; response: Response }>) {
  const { data, error, response } = await responsePromise;

  if (error) {
    // Throw a structured error that our components can catch
    throw new ApiError(
      error.message || 'An unknown API error occurred',
      response.status,
      error
    );
  }

  return data as T;
}
