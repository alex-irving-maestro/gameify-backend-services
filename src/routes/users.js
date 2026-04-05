const { Router } = require('express');
const controller = require('../controllers/userController');

const router = Router();

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
