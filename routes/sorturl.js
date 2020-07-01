const express = require('express');
const router = express.Router();
const {
  getShorturl,
  getSingleUrls,
  createUrls,
  createShorturlByUser,
  updateUrlshortner, 
  deleteUrlshortner
} = require('../controllers/sorturl');

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getShorturl)
router.route('/shortUrls').post(protect, authorize(['user', 'admin']), createUrls);
router.route('/:shortUrl').get(getSingleUrls);
router.route('/:id').post(protect, authorize(['user', 'admin']),   createShorturlByUser).put(protect, authorize(['admin']) ,updateUrlshortner).delete(protect, deleteUrlshortner)




module.exports = router;