const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `APIリクエストに失敗しました: ${response.status} ${response.statusText}`,
    );
  }

  return response;
}

function request(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<Response> {
  return apiFetch(path, {
    ...init,
    method,
    headers:
      body === undefined
        ? init?.headers
        : { "Content-Type": "application/json", ...init?.headers },
    body: body === undefined ? init?.body : JSON.stringify(body),
  });
}

export const apiClient = {
  get: (path: string, init?: RequestInit) =>
    request("GET", path, undefined, init),
  post: (path: string, body?: unknown, init?: RequestInit) =>
    request("POST", path, body, init),
  put: (path: string, body?: unknown, init?: RequestInit) =>
    request("PUT", path, body, init),
  patch: (path: string, body?: unknown, init?: RequestInit) =>
    request("PATCH", path, body, init),
  delete: (path: string, init?: RequestInit) =>
    request("DELETE", path, undefined, init),
};
