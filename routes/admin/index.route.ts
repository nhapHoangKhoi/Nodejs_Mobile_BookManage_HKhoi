import { Router } from "express";

import authRoutes from "./auth.route";
import bookRoutes from "./book.route";

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);

export default router;