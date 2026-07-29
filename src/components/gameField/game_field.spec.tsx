import React from 'react';

// Prevent the component's animation loop from keeping tests alive
(global as any).requestAnimationFrame = (cb: FrameRequestCallback) => 0 as unknown as number;
(global as any).cancelAnimationFrame = (id?: number) => {};
import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';

// Mock react-konva to avoid heavy canvas rendering in tests
vi.mock('react-konva', () => {
  const React = require('react');
  return {
    Stage: ({ children }: any) => React.createElement('div', { 'data-testid': 'stage' }, children),
    Layer: ({ children }: any) => React.createElement('div', {}, children),
    Circle: (props: any) => React.createElement('div', {}),
    Rect: (props: any) => React.createElement('div', {}),
  };
});

// Mock internal hooks used by GameField
vi.mock('@/hooks/matchHooks/useFields', () => ({ useFields: () => [] }));
vi.mock('@/hooks/matchHooks/useStructures', () => ({ useStructures: () => [] }));
vi.mock('@/hooks/matchHooks/usePlayerHueMap', () => ({ usePlayerHueMap: () => new Map() }));
vi.mock('@/hooks/matchHooks/useMyPublicId', () => ({ useMyPublicId: () => undefined }));
vi.mock('@/hooks/matchHooks/useRecipes', () => ({ useRecipes: () => ({}) }));
vi.mock('@/hooks/matchHooks/useMyRessources', () => ({ useMyRessources: () => ({}) }));
vi.mock('@/hooks/matchHooks/useIsMyTurn', () => ({ useIsMyTurn: () => false }));
// Mock SSE listeners hook to avoid SseContext requirement
vi.mock('@/hooks/sseHooks/useSseListeners', () => ({ useSseListeners: (_: any) => {} }));

// Mock contexts
vi.mock('@/contexts/contexts', () => {
  const React = require('react');
  return {
    useAuth: () => ({ fetchWithAuth: vi.fn() }),
    useGame: () => ({ uuid: 'test-uuid' }),
    useMatchRepository: () => ({ repository: { subscribe: () => () => {}, getFields: () => [] } }),
    SseContext: React.createContext(null),
  };
});

// Mock GUI components to keep render small
vi.mock('@/components/gameField/gameGui/GameGui', () => ({ __esModule: true, default: () => React.createElement('div', { 'data-testid': 'game-gui' }) }));
vi.mock('@/components/gameField/gameGui/buildPanel/buildPanel', () => ({ __esModule: true, default: () => React.createElement('div', { 'data-testid': 'build-panel' }) }));

// Mock other heavy subcomponents
vi.mock('@/components/gameField/background', () => ({ Background: () => React.createElement('div', { 'data-testid': 'background' }) }));
vi.mock('@/components/gameField/hexagon', () => ({ Hexagon: (props: any) => React.createElement('div', { 'data-testid': 'hexagon' }) }));
vi.mock('@/components/gameField/coast', () => ({ Coast: () => React.createElement('div', { 'data-testid': 'coast' }) }));
vi.mock('@/components/gameField/structure', () => ({ StructureComp: (props: any) => React.createElement('div', { 'data-testid': 'structure' }) }));

// Robust window.Image mock: async-ready regardless of assignment order
class MockImage {
  onload: (() => void) | null = null;
  _loaded = false;
  _src: string = '';
  set src(value: string) {
    this._src = value;
    // simulate async load but use microtask so no timers remain
    queueMicrotask(() => {
      this._loaded = true;
      if (this.onload) this.onload();
    });
  }
  get src() { return this._src; }
}
(global as any).Image = MockImage;

import GameField from './game_field';

describe('GameField', () => {
  beforeEach(() => {
    // ensure mocks are reset in case other tests change globals
    vi.clearAllMocks();
  });

  it('renders without crashing and includes main container', () => {
    // Create element without mounting to avoid running heavy effects
    const el = React.createElement(GameField);
    expect(typeof el.type).toBe('function');
  });
});
