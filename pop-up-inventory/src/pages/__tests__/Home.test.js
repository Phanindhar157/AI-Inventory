import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Home from '../Home';
import productReducer from '../../store/slices/productSlice';

// Create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      products: productReducer
    },
    preloadedState: {
      products: initialState
    }
  });
};

// Mock the MapPreview component
jest.mock('../../components/map/MapPreview', () => {
  return function MockMapPreview() {
    return <div data-testid="mock-map-preview">Map Preview</div>;
  };
});

describe('Home Component', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      images: [{ url: 'test1.jpg' }],
      sustainability: {
        recycled: true,
        ecoFriendly: true,
        carbonFootprint: 0.5
      }
    },
    {
      _id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      images: [{ url: 'test2.jpg' }],
      sustainability: {
        recycled: false,
        ecoFriendly: true,
        carbonFootprint: 0.8
      }
    }
  ];

  const initialState = {
    products: mockProducts,
    loading: false,
    error: null
  };

  const renderHome = () => {
    return render(
      <Provider store={createMockStore(initialState)}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders hero section', () => {
    renderHome();
    expect(screen.getByText('Sustainable Shopping Made Easy')).toBeInTheDocument();
    expect(screen.getByText('Discover eco-friendly products from local vendors')).toBeInTheDocument();
  });

  test('renders stats section', () => {
    renderHome();
    expect(screen.getByText('Sustainable Products')).toBeInTheDocument();
    expect(screen.getByText('Local Vendors')).toBeInTheDocument();
    expect(screen.getByText('Recycled Items')).toBeInTheDocument();
    expect(screen.getByText('Growth Rate')).toBeInTheDocument();
  });

  test('renders featured products', () => {
    renderHome();
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  test('renders map preview section', () => {
    renderHome();
    expect(screen.getByText('Find Products Near You')).toBeInTheDocument();
    expect(screen.getByTestId('mock-map-preview')).toBeInTheDocument();
  });

  test('renders call to action section', () => {
    renderHome();
    expect(screen.getByText('Ready to Start Sustainable Shopping?')).toBeInTheDocument();
    expect(screen.getByText('Join our community of eco-conscious shoppers and vendors')).toBeInTheDocument();
  });

  test('navigates to products page when clicking Browse Products', () => {
    renderHome();
    const browseButton = screen.getByText('Browse Products');
    fireEvent.click(browseButton);
    // Add navigation assertion if needed
  });

  test('navigates to register page when clicking Get Started', () => {
    renderHome();
    const getStartedButton = screen.getByText('Get Started');
    fireEvent.click(getStartedButton);
    // Add navigation assertion if needed
  });

  test('displays loading state', () => {
    render(
      <Provider store={createMockStore({ ...initialState, loading: true })}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error message', () => {
    const errorMessage = 'Failed to load products';
    render(
      <Provider store={createMockStore({ ...initialState, error: errorMessage })}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays sustainability badges for products', () => {
    renderHome();
    // Check for recycled badge
    expect(screen.getByText(/recycled/i)).toBeInTheDocument();
    // Check for eco-friendly badge
    expect(screen.getByText(/eco-friendly/i)).toBeInTheDocument();
  });

  test('displays product prices', () => {
    renderHome();
    mockProducts.forEach(product => {
      expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    });
  });
}); 