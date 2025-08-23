import { Router } from "express";

import bookRoutes from "./book.route";
import userRoutes from "./user.route";

const router = Router();

router.use('/books', bookRoutes);
router.use('/users', userRoutes);

export default router;