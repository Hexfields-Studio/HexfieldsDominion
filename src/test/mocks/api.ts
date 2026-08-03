import { vi } from 'vitest';

export const mockApi = {
  login: vi.fn(),
  logout: vi.fn(),
  getGameState: vi.fn(),
  submitMove: vi.fn(),
};

export default mockApi;
