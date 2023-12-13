const router = require('express').Router();
const PromotionController = require('./../controllers/PromotionController');

router.delete('/delete/:promotionId', PromotionController.remove);
router.patch('/update/:promotionId', PromotionController.update);
router.post('/create', PromotionController.create);
router.get('/', PromotionController.getAll);

module.exports = router;
