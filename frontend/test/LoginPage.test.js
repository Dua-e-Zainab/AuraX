import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';  // Needed to wrap LoginPage for routing
import LoginPage from './LoginPage';

const mockFetch = jest.fn();
global.fetch = mockFetch;  // Mock fetch API

describe('LoginPage', () => {

  beforeEach(() => {
    mockFetch.mockClear();  // Clear previous mocks before each test
  });

  test('renders login form elements', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Check if the elements render correctly
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByText(/Register yourself now/i)).toBeInTheDocument();
  });

  test('shows error message if login fails', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Mocking the fetch response to simulate a failed login
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
  });

  test('disables submit button while loading', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Submit/i));

    // Check if the submit button is disabled during loading
    expect(screen.getByText(/Logging in.../i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeDisabled();
  });

  test('navigates to /projects when login is successful', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Mocking the fetch response to simulate a successful login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token' })
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the navigate function to be called (indicating a successful login)
    await waitFor(() => expect(window.location.pathname).toBe('/projects'));
  });

  test('shows error message when network fails', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Mocking the fetch to simulate a network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Submit/i));

    // Check if the error message is displayed
    await waitFor(() => expect(screen.getByText(/Something went wrong. Please try again later./i)).toBeInTheDocument());
  });

  test('email and password fields should be required', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Click submit without entering anything
    fireEvent.click(screen.getByText(/Submit/i));

    // Check if error message is displayed for both fields
    expect(screen.getByLabelText(/Email Address/i).validationMessage).toBe('Please fill out this field.');
    expect(screen.getByLabelText(/Password/i).validationMessage).toBe('Please fill out this field.');
  });

  test('clicking on "forgot password" link redirects to the forgot password page', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Forgot password\?/i));

    // Check if the URL changes
    expect(window.location.pathname).toBe('/forgot-password');
  });
});
