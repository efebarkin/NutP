import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

// GET /api/foods - Paginated list of foods with optional search and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortField = req.query.sortField || 'name.tr';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Build query
    const query = {};
    if (search) {
      query['$or'] = [
        { 'name.tr': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }

    // Get total count for pagination
    const total = await Food.countDocuments(query);

    // Get paginated results
    const foods = await Food.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get category statistics
    const categories = await Food.aggregate([
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        avgCalories: { $avg: '$nutrients.energy.value' },
        avgProtein: { $avg: '$nutrients.protein.value' }
      }},
      { $sort: { count: -1 } }
    ]);

    // Return response
    res.json({
      foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        categories,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/foods/:id - Get a single food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
