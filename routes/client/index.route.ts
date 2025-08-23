import { Router } from "express";

import bookRoutes from "./book.route";

const router = Router();

router.use('/books', bookRoutes);

export default router;