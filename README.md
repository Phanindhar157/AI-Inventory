# AI-Powered Sustainable Pop-Up Shop Inventory Management

A comprehensive solution for managing inventory in sustainable pop-up shops, featuring AI-powered image recognition, real-time location tracking, and social media integration.

## Features

- **AI-Powered Inventory Management**
  - Image-based product cataloging
  - Automated sustainability scoring
  - Demand prediction using machine learning
  - OCR for product details extraction

- **Real-Time Location Tracking**
  - GPS tracking for mobile inventory
  - Geospatial queries for nearby products
  - Route optimization for deliveries
  - Coverage area analysis

- **Social Media Integration**
  - Automatic posting to Facebook, Twitter, and Instagram
  - Real-time inventory updates
  - Sustainable product promotion
  - Social media analytics

- **Sustainability Features**
  - Eco-friendly product categorization
  - Carbon footprint tracking
  - Sustainable packaging options
  - Local sourcing support

## Tech Stack

### Frontend
- React.js
- Material-UI / Tailwind CSS
- Redux Toolkit
- Leaflet.js for maps
- Socket.IO for real-time updates

### Backend
- Node.js / Express.js
- MongoDB with Mongoose
- Socket.IO for real-time communication
- TensorFlow.js for AI features
- OpenCV for image processing

### AI & Machine Learning
- TensorFlow for image recognition
- Scikit-learn for demand prediction
- Tesseract.js for OCR
- Custom sustainability scoring model

### Social Media Integration
- Facebook Graph API
- Twitter API
- Instagram API

### Cloud Services
- AWS S3 for image storage
- MongoDB Atlas for database
- Firebase for real-time features

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS Account (for S3)
- Social Media API Keys

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-inventory.git
cd ai-inventory
```

2. Install backend dependencies:
```bash
cd ai-inventory-backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../pop-up-inventory
npm install
```

4. Configure environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables with your credentials

5. Start the development servers:

Backend:
```bash
cd ai-inventory-backend
npm run dev
```

Frontend:
```bash
cd pop-up-inventory
npm start
```

## Project Structure

```
ai-inventory/
├── ai-inventory-backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── server.js
└── pop-up-inventory/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   └── utils/
    └── package.json
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- OpenStreetMap for map data
- TensorFlow.js team for AI capabilities
- MongoDB team for database support
- All contributors and maintainers

 