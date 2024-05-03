const { Router } = require('express');
const CTRL = require('../ctrl/ctrl');

const router = Router();

router.post('/authen', CTRL.login_post);
router.post('/getags', CTRL.getAllTag);
router.post('/getrealtime', CTRL.getRealtime);

module.exports = router;