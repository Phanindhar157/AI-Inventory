import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Eco,
  LocalShipping,
  Recycling,
  TrendingUp,
  LocationOn
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import MapPreview from '../components/map/MapPreview';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 3);

  const stats = [
    {
      title: 'Sustainable Products',
      value: '500+',
      icon: <Eco sx={{ fontSize: 40 }} />,
      color: '#2E7D32'
    },
    {
      title: 'Local Vendors',
      value: '50+',
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: '#1976D2'
    },
    {
      title: 'Recycled Items',
      value: '75%',
      icon: <Recycling sx={{ fontSize: 40 }} />,
      color: '#FFA000'
    },
    {
      title: 'Growth Rate',
      value: '25%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#D32F2F'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          mt: 4,
          mb: 8,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
          borderRadius: 2,
          p: 6,
          color: 'white'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Sustainable Shopping Made Easy
        </Typography>
        <Typography variant="h5" gutterBottom>
          Discover eco-friendly products from local vendors
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Browse Products
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2
              }}
            >
              <Box sx={{ color: stat.color, mb: 2 }}>
                {stat.icon}
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {stat.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Featured Products */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Featured Products
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {featuredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images[0]?.url || '/placeholder.jpg'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/products/${product._id}`}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Map Preview */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Find Products Near You
        </Typography>
        <Card sx={{ height: 400 }}>
          <MapPreview />
        </Card>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          background: 'linear-gradient(45deg, #FFA000 30%, #FFB74D 90%)',
          borderRadius: 2,
          p: 6,
          color: 'white',
          mb: 8
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Start Sustainable Shopping?
        </Typography>
        <Typography variant="h6" gutterBottom>
          Join our community of eco-conscious shoppers and vendors
        </Typography>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 