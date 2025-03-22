const tf = require('@tensorflow/tfjs-node');
const cv = require('opencv4nodejs');
const { createWorker } = require('tesseract.js');

class AIService {
  constructor() {
    this.model = null;
    this.worker = null;
  }

  async initialize() {
    try {
      // Load TensorFlow model for image recognition
      this.model = await tf.loadLayersModel('file://./models/product-classifier/model.json');
      
      // Initialize Tesseract worker for OCR
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    } catch (error) {
      console.error('Error initializing AI service:', error);
      throw error;
    }
  }

  async analyzeImage(imageBuffer) {
    try {
      // Convert image buffer to OpenCV format
      const image = cv.imdecode(imageBuffer);
      
      // Preprocess image
      const processedImage = this.preprocessImage(image);
      
      // Run image recognition
      const predictions = await this.model.predict(processedImage);
      
      // Extract text from image (OCR)
      const { data: { text } } = await this.worker.recognize(imageBuffer);
      
      // Analyze sustainability metrics
      const sustainabilityScore = await this.calculateSustainabilityScore(predictions);
      
      return {
        tags: this.extractTags(predictions),
        text,
        sustainabilityScore,
        aiTags: this.generateAITags(predictions, text)
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  preprocessImage(image) {
    // Resize image to model input size
    const resized = image.resize(224, 224);
    
    // Convert to RGB if needed
    const rgb = resized.cvtColor(cv.COLOR_BGR2RGB);
    
    // Normalize pixel values
    const normalized = rgb.div(255.0);
    
    // Convert to tensor
    return tf.tensor3d(normalized.getDataAsArray());
  }

  async predictDemand(productId, historicalData) {
    try {
      // Prepare features for prediction
      const features = this.prepareDemandFeatures(historicalData);
      
      // Run demand prediction model
      const prediction = await this.model.predict(features);
      
      return {
        predictedDemand: prediction.dataSync()[0],
        confidence: this.calculateConfidence(prediction)
      };
    } catch (error) {
      console.error('Error predicting demand:', error);
      throw error;
    }
  }

  prepareDemandFeatures(historicalData) {
    // Extract relevant features from historical data
    const features = {
      seasonality: this.calculateSeasonality(historicalData),
      location: historicalData.location,
      weather: historicalData.weather,
      events: historicalData.events,
      price: historicalData.price,
      previousDemand: historicalData.previousDemand
    };
    
    return tf.tensor2d([Object.values(features)]);
  }

  calculateSeasonality(historicalData) {
    // Implement seasonality calculation based on historical data
    return 0; // Placeholder
  }

  calculateConfidence(prediction) {
    // Calculate confidence score based on prediction variance
    return 0.8; // Placeholder
  }

  async calculateSustainabilityScore(predictions) {
    // Implement sustainability scoring based on product attributes
    return 0.85; // Placeholder
  }

  extractTags(predictions) {
    // Extract relevant tags from model predictions
    return ['sustainable', 'eco-friendly', 'local']; // Placeholder
  }

  generateAITags(predictions, text) {
    // Generate AI tags based on predictions and OCR text
    return ['handmade', 'recycled', 'organic']; // Placeholder
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
    }
    if (this.model) {
      this.model.dispose();
    }
  }
}

module.exports = new AIService(); 