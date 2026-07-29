import { render } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { HEARTBEAT_INTERVAL } from '@/constants/constants';
import { useHeartbeat } from './useHeartbeat';

// Mock the auth context used by the hook
const fetchWithAuth = vi.fn();
vi.mock('@/contexts/contexts', () => ({
  useAuth: () => ({ fetchWithAuth }),
}));

const TestComponent: React.FC<{ lobby?: string }> = ({ lobby }) => {
  useHeartbeat(lobby);
  return <div>ok</div>;
};

describe('useHeartbeat', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    fetchWithAuth.mockClear();
    localStorage.clear();
    localStorage.setItem('playerId', '123');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules heartbeat calls while lobbyCode is present', () => {
    render(<TestComponent lobby="ABC" />);

    // advance timers a few intervals
    vi.advanceTimersByTime(HEARTBEAT_INTERVAL * 3 + 100);

    // expect fetchWithAuth to have been called roughly 3 times
    expect(fetchWithAuth).toHaveBeenCalled();
    expect(fetchWithAuth.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
