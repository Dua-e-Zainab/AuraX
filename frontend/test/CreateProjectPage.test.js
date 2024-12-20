import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateProjectPage from '../CreateProjectPage';

// Mock the fetch API
global.fetch = jest.fn();

describe('CreateProjectPage Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the Create Project Page correctly', () => {
    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Check if the main elements are rendered
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain/i)).toBeInTheDocument();
  });

  it('shows an error message if fields are empty', async () => {
    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Click the Save button without filling fields
    fireEvent.click(screen.getByText(/Save/i));

    // Check for error message
    expect(await screen.findByText(/All fields are required/i)).toBeInTheDocument();
  });

  it('shows an error message for invalid URL format', async () => {
    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Fill in the fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Website URL/i), { target: { value: 'invalid-url' } });
    fireEvent.change(screen.getByLabelText(/Domain/i), { target: { value: 'Technology' } });

    // Click the Save button
    fireEvent.click(screen.getByText(/Save/i));

    // Check for error message
    expect(await screen.findByText(/Please enter a valid URL/i)).toBeInTheDocument();
  });

  it('submits the form successfully with valid data', async () => {
    // Mock the fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Project created successfully' }),
    });

    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Fill in the fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Website URL/i), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText(/Domain/i), { target: { value: 'Technology' } });

    // Click the Save button
    fireEvent.click(screen.getByText(/Save/i));

    // Wait for popup to appear
    expect(await screen.findByText(/Project created successfully/i)).toBeInTheDocument();
  });

  it('shows an error message if the backend returns an error', async () => {
    // Mock the fetch response with an error
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Something went wrong' }),
    });

    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Fill in the fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Website URL/i), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText(/Domain/i), { target: { value: 'Technology' } });

    // Click the Save button
    fireEvent.click(screen.getByText(/Save/i));

    // Check for error message from the backend
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows an error message if delete is clicked without a project name', () => {
    render(
      <Router>
        <CreateProjectPage />
      </Router>
    );

    // Click the Delete button without a project name
    fireEvent.click(screen.getByText(/Delete this project/i));

    // Check for error message
    expect(screen.getByText(/Please create a project first before deleting/i)).toBeInTheDocument();
  });
});
