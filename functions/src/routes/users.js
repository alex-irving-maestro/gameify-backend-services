const { Router } = require('express');
const controller = require('../controllers/userController');

const router = Router();

const UNLOCK_TYPES = ['backgrounds', 'banners', 'icons', 'wrappers'];

function validateType(req, res, next) {
  if (!UNLOCK_TYPES.includes(req.params.type)) {
    return res.status(400).json({ error: `type must be one of: ${UNLOCK_TYPES.join(', ')}` });
  }
  next();
}

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

router.post('/:id/unlocked/all', controller.unlockAll);
router.get('/:id/unlocked/:type', validateType, controller.getUnlocked);
router.post('/:id/unlocked/:type/:itemId', validateType, controller.unlockItem);
router.delete('/:id/unlocked/:type/:itemId', validateType, controller.revokeItem);

router.put('/:id/selected/:type/:itemId', validateType, controller.selectItem);
router.delete('/:id/selected/:type', validateType, controller.deselectItem);

module.exports = router;
