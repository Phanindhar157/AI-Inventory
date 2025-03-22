const { FacebookApi } = require('facebook-node-sdk');
const { TwitterApi } = require('twitter-api-v2');
const { IgApiClient } = require('instagram-private-api');

class SocialMediaService {
  constructor() {
    this.facebook = new FacebookApi({
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN
    });

    this.twitter = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET
    });

    this.instagram = new IgApiClient();
  }

  async initialize() {
    try {
      // Initialize Instagram client
      this.instagram.state.generateDevice(process.env.INSTAGRAM_USERNAME);
      await this.instagram.simulate.preLoginFlow();
      await this.instagram.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    } catch (error) {
      console.error('Error initializing social media service:', error);
      throw error;
    }
  }

  async postToFacebook(product) {
    try {
      const post = {
        message: this.generateFacebookPost(product),
        link: `${process.env.FRONTEND_URL}/product/${product._id}`,
        picture: product.images[0]?.url
      };

      await this.facebook.api('/me/feed', 'post', post);
      return true;
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      throw error;
    }
  }

  async postToTwitter(product) {
    try {
      const tweet = this.generateTwitterPost(product);
      await this.twitter.v2.tweet(tweet);
      return true;
    } catch (error) {
      console.error('Error posting to Twitter:', error);
      throw error;
    }
  }

  async postToInstagram(product) {
    try {
      const caption = this.generateInstagramPost(product);
      const imageUrl = product.images[0]?.url;

      // Download image
      const imageBuffer = await this.downloadImage(imageUrl);

      // Upload to Instagram
      const publishResult = await this.instagram.publish.photo({
        file: imageBuffer,
        caption
      });

      return publishResult;
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      throw error;
    }
  }

  generateFacebookPost(product) {
    return `New sustainable product available! 🌱\n\n${product.name}\n${product.description}\n\nPrice: $${product.price}\n\n#SustainableShopping #EcoFriendly #LocalBusiness`;
  }

  generateTwitterPost(product) {
    return `🆕 New sustainable product: ${product.name}\n\n$${product.price} | ${product.description.substring(0, 100)}...\n\n#SustainableShopping #EcoFriendly`;
  }

  generateInstagramPost(product) {
    return `🌱 New sustainable product available!\n\n${product.name}\n${product.description}\n\nPrice: $${product.price}\n\n#SustainableShopping #EcoFriendly #LocalBusiness #SustainableFashion`;
  }

  async downloadImage(url) {
    const response = await fetch(url);
    return await response.buffer();
  }

  async syncInventory(product) {
    try {
      // Post to all social media platforms
      await Promise.all([
        this.postToFacebook(product),
        this.postToTwitter(product),
        this.postToInstagram(product)
      ]);

      return true;
    } catch (error) {
      console.error('Error syncing inventory to social media:', error);
      throw error;
    }
  }

  async updateSocialMediaLinks(productId, socialMediaLinks) {
    try {
      // Update social media links in the database
      await Product.findByIdAndUpdate(productId, {
        'socialMedia': socialMediaLinks
      });

      return true;
    } catch (error) {
      console.error('Error updating social media links:', error);
      throw error;
    }
  }
}

module.exports = new SocialMediaService(); 