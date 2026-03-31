import express, { Router } from "express";
import { validateRequest } from "../middleware/validation";
import { productSchemas } from "../validation/productSchemas";
import * as productController from "../controllers/productController";
import { validateHeaderName } from "node:http";

const router: Router = express.Router();

router.post("/products", validateRequest(productSchemas.create), productController.createProductController);
router.get("/products/:id", validateRequest(productSchemas.getById), productController.getProductByIdController);
router.put("/products/:id", validateRequest(productSchemas.update), productController.updateProductController);
router.delete("/products/:id", validateRequest(productSchemas.delete), productController.deleteProductController);
router.get("/products", productController.getAllProductsController);
export default router;