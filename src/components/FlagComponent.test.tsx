import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlagComponent from './FlagComponent';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the Typewriter component
jest.mock('./TypeWriter', () => {
  return function MockTypewriter({ text }: { text: string }) {
    return <div data-testid="mock-typewriter">{text}</div>;
  };
});

describe('FlagComponent', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    render(<FlagComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches flag data and renders Typewriter component', async () => {
    const mockFlag = 'Test Flag';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockFlag),
    });

    render(<FlagComponent />);

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the flag to be fetched and rendered
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }).then(() => expect(screen.getByTestId('mock-typewriter')).toHaveTextContent(mockFlag));

    // Verify that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/656c61'
    );
  });

  it('handles fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    render(<FlagComponent />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
