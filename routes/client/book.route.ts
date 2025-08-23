import { Router } from "express";
import * as bookController from "../../controllers/client/book.controller";

const router = Router();

// (infinit loading)
router.get("/", bookController.getListBooks);

export default router;