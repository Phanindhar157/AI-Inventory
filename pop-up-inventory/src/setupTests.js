// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn()
  disconnect = jest.fn()
  unobserve = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
  observe = jest.fn()
  disconnect = jest.fn()
  unobserve = jest.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(),
  tileLayer: jest.fn(),
  marker: jest.fn(),
  popup: jest.fn(),
  icon: jest.fn(),
  latLng: jest.fn(),
  latLngBounds: jest.fn(),
  DomUtil: {
    create: jest.fn(),
    addClass: jest.fn(),
    removeClass: jest.fn(),
  },
}));

// Mock react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mock-map-container">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile-layer">Tile Layer</div>,
  Marker: () => <div data-testid="mock-marker">Marker</div>,
  Popup: ({ children }) => <div data-testid="mock-popup">{children}</div>,
  useMap: () => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }),
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

// Mock @mui/material
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => false,
}));

// Mock @mui/icons-material
jest.mock('@mui/icons-material', () => ({
  ...jest.requireActual('@mui/icons-material'),
  ShoppingCart: () => <div data-testid="shopping-cart-icon">Cart Icon</div>,
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>,
  Close: () => <div data-testid="close-icon">Close Icon</div>,
}));
