import { Router } from "express";

import { StockEntryController } from "../controllers/stockEntry.js";

export const stockEntryRouters = Router();

stockEntryRouters.post("/", StockEntryController.register);

stockEntryRouters.get("/", StockEntryController.getAll);

stockEntryRouters.get("/by-product", StockEntryController.getByProduct);

stockEntryRouters.get("/by-supplier", StockEntryController.getBySupplier);