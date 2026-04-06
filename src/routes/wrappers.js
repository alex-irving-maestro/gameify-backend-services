const { Router } = require('express');
const controller = require('../controllers/wrapperController');

const router = Router();

router.get('/', controller.listWrappers);
router.post('/', controller.createWrapper);
router.get('/:id', controller.getWrapper);
router.put('/:id', controller.updateWrapper);
router.delete('/:id', controller.deleteWrapper);

module.exports = router;
