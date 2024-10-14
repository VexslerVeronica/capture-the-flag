import { render, screen } from '@testing-library/react';
import Typewriter from './TypeWriter';
import React from 'react';

jest.useFakeTimers(); // Mock timers for controlling time-based tests

test('renders typewriter animation', () => {
  const text = 'Hello!';
  render(<Typewriter text={text} />);
  // Initially, no text should be rendered
  expect(screen.queryByText('H')).toBeNull();

  // Advance timer to show the first character
  React.act(() => jest.advanceTimersByTime(500));
  expect(screen.getByText('H')).toBeInTheDocument();

  // Advance timers to show the rest of the characters
  React.act(() => jest.advanceTimersByTime(500));
  expect(screen.getByText('e')).toBeInTheDocument();

  React.act(() => jest.advanceTimersByTime(500));
  expect(screen.getByText('l')).toBeInTheDocument();

  React.act(() => jest.advanceTimersByTime(500));
  // Must account for duplicates
  expect(screen.getAllByText('l')[1]).toBeInTheDocument();

  React.act(() => jest.advanceTimersByTime(500));
  expect(screen.getByText('o')).toBeInTheDocument();

  React.act(() => jest.advanceTimersByTime(500));
  expect(screen.getByText('!')).toBeInTheDocument();
});