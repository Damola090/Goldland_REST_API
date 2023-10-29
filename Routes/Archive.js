const express = require('express');
const router = express.Router()

const { 
    createArchive,
    fetchAllArchiveImage,
    fetchAllArchiveVideo,
    fetchSingleArchive,
    deleteSingleArchive
} = require('../controllers/ArchiveController');

const { AuthMiddleware } = require('../middleware/AuthMiddleware');

router.route('/create-archive').post(createArchive);
router.route('/get-all-video-archive').get(fetchAllArchiveVideo);
router.route('/get-all-image-archive').get(fetchAllArchiveImage);
router.route('/get-single-archive/:id').get(fetchSingleArchive);
router.route('/delete-single-archive').delete(deleteSingleArchive);


module.exports = router