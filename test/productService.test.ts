import * as productService from "../src/api/v1/services/productServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository.ts");

describe("Product Services", () => {
    describe("POST createProduct", () => {
        it("should successfully create new event", async() => {
            // Arrange
            const mockInput = {
                id: "prd_00001",
                name: "Testing Jeans",
                sku: "TST0001",
                quantity: 100,
                price: 20.00,
                category: "other"
            };
            const mockServiceResponse = {
                ... mockInput,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            //(firestoreRepository.createDocument as jest.Mock).mockRejectedValue(mockRepositoryResponse);

            // Act
            const actual = await productService.createProduct(mockInput);

            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalled();
            expect(actual).toHaveProperty("id", mockInput.id);
            expect(actual).toHaveProperty("name", mockInput.name);
            expect(actual).toHaveProperty("sku", mockInput.sku);
            expect(actual).toHaveProperty("quantity", mockInput.quantity);
            expect(actual).toHaveProperty("category", mockInput.category);
            expect(actual).toHaveProperty("createdAt", mockServiceResponse.createdAt);
            expect(actual).toHaveProperty("updatedAt", mockServiceResponse.updatedAt);
        });
    });
});