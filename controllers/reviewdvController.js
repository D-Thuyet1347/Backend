import ReviewSV from '../models/reviewdvModel.js';

const addReviewSV = async (req, res) => {
    const { serviceId, userId, rating, comment } = req.body;

    if (!serviceId || !userId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const newReview = new ReviewSV({ serviceId, userId, rating, comment });
      await newReview.save();
      res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ success: false, message: 'Failed to add review' });
    }
};

const getReviewsByService = async (req, res) => {
    const { serviceId } = req.params;

    try {
      const reviews = await ReviewSV.find({ serviceId }).sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

const removeReviewSV = async (req, res) => {
    const { id } = req.params;

    try {
      await ReviewSV.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Review removed successfully' });
    } catch (error) {
      console.error('Error removing review:', error);
      res.status(500).json({ success: false, message: 'Failed to remove review' });
    }
};

export { addReviewSV, getReviewsByService, removeReviewSV };
