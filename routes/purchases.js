const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');

router.get('/', PurchaseController.index);
router.get('/create', PurchaseController.create);
router.post('/create', PurchaseController.store);
router.post('/cancel/:id', PurchaseController.cancel);

module.exports = router;
