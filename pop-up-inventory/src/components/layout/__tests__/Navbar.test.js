import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../Navbar';
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

describe('Navbar Component', () => {
  const renderNavbar = (initialState = { user: null, token: null }) => {
    return render(
      <Provider store={createMockStore({ auth: initialState })}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders navbar with logo and brand name', () => {
    renderNavbar();
    expect(screen.getByText('AI Inventory')).toBeInTheDocument();
  });

  test('renders navigation links for unauthenticated users', () => {
    renderNavbar();
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/vendors/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders navigation links for authenticated users', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderNavbar({ user: mockUser, token: 'mock-token' });
    
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/vendors/i)).toBeInTheDocument();
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('renders vendor-specific links for vendor users', () => {
    const mockVendor = {
      _id: '1',
      name: 'John Doe',
      role: 'vendor'
    };
    renderNavbar({ user: mockVendor, token: 'mock-token' });
    
    expect(screen.getByText(/my products/i)).toBeInTheDocument();
    expect(screen.getByText(/add product/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
  });

  test('toggles mobile menu when menu button is clicked', () => {
    renderNavbar();
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Check if mobile menu is visible
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closes mobile menu when close button is clicked', () => {
    renderNavbar();
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Close menu
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check if mobile menu is not visible
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('displays user name in profile menu for authenticated users', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderNavbar({ user: mockUser, token: 'mock-token' });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('handles logout when logout button is clicked', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderNavbar({ user: mockUser, token: 'mock-token' });
    
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    
    // Add logout assertion if needed
  });

  test('displays cart icon with item count for authenticated users', () => {
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      role: 'customer'
    };
    renderNavbar({ user: mockUser, token: 'mock-token' });
    
    const cartIcon = screen.getByTestId('shopping-cart-icon');
    expect(cartIcon).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
}); 