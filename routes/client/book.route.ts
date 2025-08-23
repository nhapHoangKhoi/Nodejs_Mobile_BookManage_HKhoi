import { Router } from "express";
import * as bookController from "../../controllers/client/book.controller";

const router = Router();

// (infinite loading)
router.get("/", bookController.getListBooks);

export default router;