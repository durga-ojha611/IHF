import express from 'express';
import {
  updateMe,
  deleteMe,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// Address book routes
router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:addressId')
  .patch(updateAddress)
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
