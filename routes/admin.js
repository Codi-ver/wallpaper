const express = require('express');

const router = express.Router();

const adminController = require('../controller/admins'); //f
const authMiddleware = require('../middleware/auth');

router.route('/').post(authMiddleware, adminController.addAdmin);

router.route('/login').post(adminController.login);

router.route('/update').put(authMiddleware, adminController.updateAdmin);


module.exports = router;