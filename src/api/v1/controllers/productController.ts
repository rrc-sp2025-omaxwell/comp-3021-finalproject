import * as productServices from "../services/productServices";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// Create Controller
export const createProductController = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const {
            id, name, sku, 
            quantity, price, category,
        } = req.body

        const productData = {
            id, name, sku, 
            quantity, price, category,
         }

        const newProduct = await productServices.createProduct(productData);
        res.status(HTTP_STATUS.OK).json(successResponse({newProduct}, "Product created"));
    } catch (error: unknown){
        next(error);
    }
}

// Get By Id Controller
export const getProductByIdController = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try{
        const { id } = req.params;
        const product = await productServices.getProductById(id as string);
        res.status(HTTP_STATUS.OK).json(successResponse(product, "Product retrieved successfully"));
    } catch (error: unknown) {
        next(error);
    }
}

// PUT update product
export const updateProductController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const { name, quantity, price, category} = req.body;

        const newProductData = { name, quantity, price, category};

        const updatedProduct = await productServices.updateProduct(id as string,
            newProductData);

        res.status(HTTP_STATUS.OK).json(successResponse({updatedProduct}, 
            "Product successfully updated."));
    } catch (error:unknown) {
        next(error);
    }
}

// DELETE delete by id controller

export const deleteProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise <void> => {
    try {
        const { id } = req.params;
        await productServices.deleteProduct(id as string);
        res.status(HTTP_STATUS.OK).json(successResponse("Product deleted successfully"));
    } catch (error: unknown) {
        next(error);
    }   
};

// GET get all products controller

export const getAllProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise <void> => {
    try {
        const products = await productServices.getAllProducts();
        const count = products.length
        res.status(HTTP_STATUS.OK).json(successResponse({count, products} , "Events retrieved"));
    } catch (error: unknown) {
        next(error);
    }
}