import mongoose from 'mongoose';
import Food from '../server/models/Food.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Regular expressions to identify brand names
const brandPatterns = [
  /\bMcDONALD'?s\b/i,
  /\bAPPLEBEE'?S\b/i,
  /\bBabyfood\b/i,
  /\bBURGER KING\b/i,
  // Add more patterns as needed
  // Example: 
];

// Function to check if a food name contains a brand name
function isBrandedFood(foodName) {
  if (!foodName) return false;
  
  // Check if the name matches any of the brand patterns
  for (const pattern of brandPatterns) {
    if (pattern.test(foodName)) {
      return true;
    }
  }
  
  return false;
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Find and list branded food items
async function findBrandedFoods() {
  try {
    const foods = await Food.find({}).lean();
    console.log(`Total foods in database: ${foods.length}`);
    
    const brandedFoods = foods.filter(food => 
      isBrandedFood(food.name.en) || isBrandedFood(food.name.tr)
    );
    
    console.log(`Found ${brandedFoods.length} foods with brand names matching your patterns:`);
    
    // Print the first 20 branded foods with their IDs
    brandedFoods.slice(0, 20).forEach(food => {
      console.log(`ID: ${food._id}, Name (EN): ${food.name.en}, Name (TR): ${food.name.tr}`);
    });
    
    if (brandedFoods.length > 20) {
      console.log(`... and ${brandedFoods.length - 20} more`);
    }
    
    return brandedFoods;
  } catch (error) {
    console.error('Error finding branded foods:', error);
  }
}

// Remove branded food items
async function removeBrandedFoods(confirmDelete = false) {
  try {
    const brandedFoods = await findBrandedFoods();
    
    if (!confirmDelete) {
      console.log('\nThis was a dry run. No foods were deleted.');
      console.log('To delete these foods, run the script with the --confirm flag');
      return;
    }
    
    // Get IDs of branded foods
    const brandedFoodIds = brandedFoods.map(food => food._id);
    
    // Delete the branded foods
    const result = await Food.deleteMany({ _id: { $in: brandedFoodIds } });
    
    console.log(`\nDeleted ${result.deletedCount} branded food items from the database`);
  } catch (error) {
    console.error('Error removing branded foods:', error);
  }
}

// Main function
async function main() {
  await connectDB();
  
  // Check if the --confirm flag is passed
  const confirmDelete = process.argv.includes('--confirm');
  
  await removeBrandedFoods(confirmDelete);
  
  // Close the MongoDB connection
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
}

// Run the main function
main();