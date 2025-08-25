import { Router } from "express";
import * as searchController from "../../controllers/client/search.controller";

const router = Router();

// (infinite loading)
router.get("/", searchController.searchItems);

export default router;