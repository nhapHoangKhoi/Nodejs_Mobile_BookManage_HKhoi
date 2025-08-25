import { Router } from "express";

import bookRoutes from "./book.route";
import userRoutes from "./user.route";
import favoriteRoutes from "./favorite.route";
import ratingRoutes from "./rating.route";
import searchRoutes from "./search.route";

const router = Router();

router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/ratings', ratingRoutes);
router.use('/search', searchRoutes);

export default router;