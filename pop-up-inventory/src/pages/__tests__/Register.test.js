import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Register from '../Register';
import authReducer from '../../store/slices/authSlice';

// Create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: initialState
    }
  });
};

describe('Register Component', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
  };

  const renderRegister = () => {
    return render(
      <Provider store={createMockStore(initialState)}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders registration form', () => {
    renderRegister();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  test('shows validation error for password mismatch', async () => {
    renderRegister();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for required fields', async () => {
    renderRegister();
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for required field messages one at a time
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderRegister();
    
    // Fill in email with invalid format
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('successful form submission', async () => {
    renderRegister();
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'customer' }
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  test('displays server error message', async () => {
    // Mock a failed registration attempt
    const errorState = {
      ...initialState,
      error: 'Registration failed. Please try again.'
    };

    render(
      <Provider store={createMockStore(errorState)}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
}); 