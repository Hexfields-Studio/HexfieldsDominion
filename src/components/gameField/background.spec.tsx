import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock react-konva Image component to a simple div so rendering is lightweight
vi.mock('react-konva', () => ({ Image: (props: any) => React.createElement('div', { 'data-testid': 'konva-image' }) }));

// Provide a stable Image mock for import.meta.env usage
class MockImage {
  onload: (() => void) | null = null;
  _src = '';
  set src(v: string) {
    this._src = v;
    queueMicrotask(() => { if (this.onload) this.onload(); });
  }
  get src() { return this._src; }
}
(global as any).Image = MockImage;

import { Background } from './background';

describe('Background', () => {
  it('renders tile images placeholders', async () => {
    const { findAllByTestId } = render(React.createElement(Background, { imagePath: 'fields/waterSeamless.png', gridSize: 2 }));
    const els = await findAllByTestId('konva-image');
    expect(els.length).toBeGreaterThan(0);
  });
});
