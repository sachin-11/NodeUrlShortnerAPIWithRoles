const express = require('express');
const router = express.Router({ mergeParams: true});
const {
  getShorturl,
  getSingleUrls,
  createUrls,
} = require('../controllers/sorturl');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getShorturl)
router.route('/shortUrls').post(protect, authorize('publisher', 'admin'), createUrls);
router.route('/:shortUrl').get(getSingleUrls);

module.exports = router;