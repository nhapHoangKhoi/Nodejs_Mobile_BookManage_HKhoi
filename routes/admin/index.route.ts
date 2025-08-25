import { Router } from "express";

import authRoutes from "./auth.route";
import bookRoutes from "./book.route";
import accountRoutes from "./account.route";

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/accounts', accountRoutes);

export default router;