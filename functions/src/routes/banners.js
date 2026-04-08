const { Router } = require('express');
const controller = require('../controllers/bannerController');

const router = Router();

router.get('/', controller.listBanners);
router.post('/', controller.createBanner);
router.get('/:id', controller.getBanner);
router.put('/:id', controller.updateBanner);
router.delete('/:id', controller.deleteBanner);

module.exports = router;
