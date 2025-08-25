import { Router } from "express";

import bookRoutes from "./book.route";
import userRoutes from "./user.route";
import favoriteRoutes from "./favorite.route";
import ratingRoutes from "./rating.route";

const router = Router();

router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/ratings', ratingRoutes);

export default router;