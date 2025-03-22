import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
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

describe('Login Component', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null
  };

  const renderLogin = () => {
    return render(
      <Provider store={createMockStore(initialState)}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation error for required fields', async () => {
    renderLogin();
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for required field messages
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    renderLogin();
    
    // Fill in email with invalid format
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test('successful login', async () => {
    renderLogin();
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  test('displays server error message', async () => {
    // Mock a failed login attempt
    const errorState = {
      ...initialState,
      error: 'Invalid email or password'
    };

    render(
      <Provider store={createMockStore(errorState)}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('navigates to register page when clicking register link', () => {
    renderLogin();
    
    const registerLink = screen.getByText(/don't have an account\?/i);
    fireEvent.click(registerLink);

    // Add navigation assertion if needed
  });

  test('navigates to forgot password page when clicking forgot password link', () => {
    renderLogin();
    
    const forgotPasswordLink = screen.getByText(/forgot password\?/i);
    fireEvent.click(forgotPasswordLink);

    // Add navigation assertion if needed
  });
}); 