import { vi } from 'vitest';

export const mockUseAuth = vi.fn().mockReturnValue({
  user: null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  error: null,
  fetchWithAuth: vi.fn(),
});

export const mockUseGame = vi.fn().mockReturnValue({
  uuid: 'test-uuid',
});

export default { mockUseAuth, mockUseGame };
