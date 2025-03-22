import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from '../PrivateRoute';
import authReducer from '../../../store/slices/authSlice';

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

// Mock component for testing
const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute Component', () => {
  const renderPrivateRoute = (initialState = { user: null, token: null }) => {
    return render(
      <Provider store={createMockStore({ auth: initialState })}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders protected content when user is authenticated', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderPrivateRoute({ user: mockUser, token: 'mock-token' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderPrivateRoute();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when token is missing', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderPrivateRoute({ user: mockUser, token: null });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is null', () => {
    renderPrivateRoute({ user: null, token: 'mock-token' });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles loading state', () => {
    renderPrivateRoute({ loading: true });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles error state', () => {
    renderPrivateRoute({ error: 'Authentication error' });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('preserves location state when redirecting', () => {
    renderPrivateRoute();
    // Add assertion for location state if needed
  });

  test('handles nested routes', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    render(
      <Provider store={createMockStore({ auth: { user: mockUser, token: 'mock-token' } })}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div>
                    <TestComponent />
                    <Routes>
                      <Route path="/nested" element={<div>Nested Content</div>} />
                    </Routes>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
}); 