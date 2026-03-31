import * as firestoreRepository from "../repositories/firestoreRepository";
import { Product } from "../models/productModel";
import { CollectionGroup } from "firebase-admin/firestore";

const COLLECTION = "products";

export const createProduct = async(
    data: {
        id: string,
        name: string,
        sku: string,
        quantity: number,
        price: number,
        category: string,
    },
): Promise<Product> => {
    try {
        const newProductData = {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await firestoreRepository.createDocument<Product>(COLLECTION, newProductData.id,newProductData);

        return {...newProductData};
    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown Error";
        throw new Error(`Failed to create product: ${error}`);
    }
};

export const getProductById = async (id:string): Promise<Product | null> => {
    try {
        const product = await firestoreRepository.getDocumentById<Product>(COLLECTION, id);
        if(!product){
            throw new Error("Product not found");
        }

        return product;
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve product: ${errorMessage}`
        );
    };
};

export const updateProduct = async(
    id: string,
    productData: Pick<Product,
        "name" |
        "quantity" |
        "price" |
        "category">
): Promise<Product | null> => {
    try {
        const updatedProductData: Partial<Product> = {}

        if (productData.name != undefined) 
            updatedProductData.name = productData.name;
        if (productData.quantity != undefined)
            updatedProductData.quantity = productData.quantity;
        if (productData.price != undefined)
            updatedProductData.price = productData.price;
        if (productData.category != undefined)
            updatedProductData.category = productData.category;

        if (Object.keys(productData).length === 0) {
            throw new Error("no fields provided to update with")
        }

        updatedProductData.updatedAt = new Date().toISOString();

        await firestoreRepository.updateDocument(COLLECTION, id, updatedProductData);

        const updatedProduct = await firestoreRepository.getDocumentById<Product>(COLLECTION, id);

        if (!updatedProduct) {
            throw new Error("Updated product not found.")
        }

        return updatedProduct;
    
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve product: ${errorMessage}`
        );
    }
}

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteProduct(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete the product: ${errorMessage}`
        );
    }
};


export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const products = await firestoreRepository.getAllProducts<Product>(COLLECTION);
        return products
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve all products: ${errorMessage}`
        );
    }
};