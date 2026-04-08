const { Router } = require('express');
const controller = require('../controllers/iconController');

const router = Router();

router.get('/', controller.listIcons);
router.post('/', controller.createIcon);
router.get('/:id', controller.getIcon);
router.put('/:id', controller.updateIcon);
router.delete('/:id', controller.deleteIcon);

module.exports = router;
