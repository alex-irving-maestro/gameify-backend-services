const { Router } = require('express');
const controller = require('../controllers/backgroundController');

const router = Router();

router.get('/', controller.listBackgrounds);
router.post('/', controller.createBackground);
router.get('/:id', controller.getBackground);
router.put('/:id', controller.updateBackground);
router.delete('/:id', controller.deleteBackground);

module.exports = router;
