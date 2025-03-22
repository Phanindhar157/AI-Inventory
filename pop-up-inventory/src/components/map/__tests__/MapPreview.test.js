import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MapPreview from '../MapPreview';

// Mock the Leaflet map component
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mock-map-container">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile-layer">Tile Layer</div>,
  Marker: () => <div data-testid="mock-marker">Marker</div>,
  Popup: ({ children }) => <div data-testid="mock-popup">{children}</div>,
  useMap: () => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  })
}));

describe('MapPreview Component', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      location: {
        type: 'Point',
        coordinates: [40.7128, -74.0060]
      },
      vendor: {
        _id: '1',
        name: 'Test Vendor 1'
      }
    },
    {
      _id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      location: {
        type: 'Point',
        coordinates: [40.7128, -74.0060]
      },
      vendor: {
        _id: '2',
        name: 'Test Vendor 2'
      }
    }
  ];

  const renderMapPreview = (props = {}) => {
    return render(
      <BrowserRouter>
        <MapPreview products={mockProducts} {...props} />
      </BrowserRouter>
    );
  };

  test('renders map container', () => {
    renderMapPreview();
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
  });

  test('renders tile layer', () => {
    renderMapPreview();
    expect(screen.getByTestId('mock-tile-layer')).toBeInTheDocument();
  });

  test('renders markers for each product', () => {
    renderMapPreview();
    const markers = screen.getAllByTestId('mock-marker');
    expect(markers).toHaveLength(mockProducts.length);
  });

  test('renders popups with product information', () => {
    renderMapPreview();
    const popups = screen.getAllByTestId('mock-popup');
    expect(popups).toHaveLength(mockProducts.length);
    
    // Check if product information is displayed in popups
    mockProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
      expect(screen.getByText(product.vendor.name)).toBeInTheDocument();
    });
  });

  test('handles empty products array', () => {
    renderMapPreview({ products: [] });
    expect(screen.queryByTestId('mock-marker')).not.toBeInTheDocument();
  });

  test('displays loading state', () => {
    renderMapPreview({ loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error message', () => {
    const errorMessage = 'Failed to load map data';
    renderMapPreview({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('handles product click', () => {
    const onProductClick = jest.fn();
    renderMapPreview({ onProductClick });

    const firstProduct = mockProducts[0];
    const productElement = screen.getByText(firstProduct.name);
    fireEvent.click(productElement);

    expect(onProductClick).toHaveBeenCalledWith(firstProduct);
  });

  test('displays custom center coordinates', () => {
    const customCenter = [40.7128, -74.0060];
    renderMapPreview({ center: customCenter });
    
    // Add assertion for custom center if needed
  });

  test('displays custom zoom level', () => {
    const customZoom = 15;
    renderMapPreview({ zoom: customZoom });
    
    // Add assertion for custom zoom if needed
  });
}); 