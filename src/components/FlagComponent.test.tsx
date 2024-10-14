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
    jest.resetAllMocks();
  });

  it('renders loading state initially', async () => {
    const mockFlag = 'Test Flag';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockFlag),
    });
    
    render(<FlagComponent />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    })
  });

  it('fetches flag data and renders Typewriter component', async () => {
    const mockFlag = 'Test Flag';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockFlag),
    });

    render(<FlagComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }).then(() => 
      expect(screen.getByTestId('mock-typewriter')).toHaveTextContent(mockFlag)
    );

    expect(global.fetch).toHaveBeenCalledWith(process.env.REACT_APP_CAPTURE_THE_FLAG_API_URL);
  });

  it('handles fetch error and displays error message', async () => {
    const errorMessage = 'Fetch failed';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<FlagComponent />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }).then(() => {
      expect(screen.getByText(`Error fetching response! + Error: Fetch failed`)).toBeInTheDocument();
    });
  });

  it('uses the correct API URL from environment variable', async () => {
    process.env.REACT_APP_CAPTURE_THE_FLAG_API_URL = 'https://custom-api-url.com';
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce('Flag'),
    });

    render(<FlagComponent />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://custom-api-url.com');
    });
  });
});
