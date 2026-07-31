import React, { createRef } from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dialog, { type DialogHandle } from './dialog';

const showModal = vi.fn();
const close = vi.fn();

vi.mock('js-confetti', () => ({
  default: vi.fn().mockImplementation(() => ({ addConfetti: vi.fn() })),
}));

beforeEach(() => {
  showModal.mockClear();
  close.mockClear();
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: showModal,
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: close,
  });
});

describe('Dialog', () => {
  it('opens and closes through the imperative handle', () => {
    const ref = createRef<DialogHandle>();

    render(<Dialog ref={ref} title="Info" />);

    act(() => {
      ref.current?.openDialog();
    });
    expect(showModal).toHaveBeenCalledTimes(1);

    act(() => {
      ref.current?.closeDialog();
    });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('renders the error state with the fallback header and action button', () => {
    render(<Dialog title="Ignored" errorMessage="Something went wrong" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders the close button only when the dialog is closable by any click', () => {
    const { rerender } = render(<Dialog title="Info" closedBy="none" />);

    expect(screen.queryByText('X')).toBeNull();

    rerender(<Dialog title="Info" closedBy="any" />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('closes when the close button is clicked', () => {
    const ref = createRef<DialogHandle>();

    render(<Dialog ref={ref} title="Info" />);

    act(() => {
      ref.current?.openDialog();
    });
    act(() => {
      fireEvent.click(screen.getByText('X'));
    });

    expect(close).toHaveBeenCalledTimes(1);
  });
});