import { describe, expect, it, beforeEach } from 'vitest';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './storage';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exposes the expected storage keys', () => {
    expect(STORAGE_KEYS).toEqual({
      LAST_LOBBY_CODE: 'lastLobbyCode',
      LAST_MATCH_UUID: 'lastMatchUUID',
      LIGHT_DARK_MODE: 'LightDarkMode',
      ACCESS_TOKEN: 'accessToken',
    });
  });

  it('returns the default value when an item is missing', () => {
    expect(getStorageItem('missing-key', { enabled: true })).toEqual({ enabled: true });
  });

  it('parses stored JSON values', () => {
    localStorage.setItem('player-settings', JSON.stringify({ theme: 'dark', volume: 3 }));

    expect(getStorageItem('player-settings', null)).toEqual({ theme: 'dark', volume: 3 });
  });

  it('stores values as JSON strings', () => {
    setStorageItem('player-settings', { theme: 'light', volume: 7 });

    expect(localStorage.getItem('player-settings')).toBe(JSON.stringify({ theme: 'light', volume: 7 }));
  });
});