export interface ApiErrorDetails {
  status: number;
  statusText: string;
  body?: unknown;
}

export class ApiError extends Error {
  readonly details: ApiErrorDetails;

  constructor(message: string, details: ApiErrorDetails) {
    super(message);
    this.details = details;
  }
}

const sanitizePath = (path: string) => path.replace(/^[\\/]+/, '');

const baseUrl = ((): string => {
  const value = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!value) {
    console.warn('VITE_API_BASE_URL non è configurata. Verrà usato un URL vuoto.');
    return '';
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
})();

export async function apiFetch<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const url = `${baseUrl}/${sanitizePath(path)}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  const contentType = response.headers.get('content-type');
  const body = contentType?.includes('application/json') ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    throw new ApiError('Richiesta API fallita', {
      status: response.status,
      statusText: response.statusText,
      body
    });
  }

  return body as TResponse;
}
