import { db } from "../../../config/firebaseConfig";

// POST Document function
export const createDocument = async<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {

        const formattedData = {
            ... data,
        }
        await db.collection(collectionName).doc(id).set(formattedData);

    } catch (error: unknown) {
        const errorMessage = 
            error instanceof Error ? error.message : "Unknown Error";
        throw new Error(`Failed to create document: ${error}`);
    }
};

// GET Document by ID
export const getDocumentById = async<T>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    try{
        let docRef: FirebaseFirestore.DocumentReference;
        docRef = await db.collection(collectionName).doc(id);

        const snapshot = await docRef.get();
        if (!snapshot)
            return null;

        return {
            ...(snapshot.data() as T)
        };

    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve the document in ${collectionName}: ${errorMessage}`
        );
    }
}; 

// PUT Update Document By Id
export const updateDocument = async<T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        let docRef: FirebaseFirestore.DocumentReference;

        docRef = await db.collection(collectionName).doc(id);

        await docRef.update(data);

    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to update the document in ${collectionName}: ${errorMessage}`
        );
    }
}

// delete product by id
export const deleteProduct = async<T>(
    collectionName: string,
    docId: string,
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(docId).delete();
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete the document in ${collectionName}: ${errorMessage}`
        );
    }
};

// get all products
export const getAllProducts = async<T>(
    collectionName: string
): Promise<T[]> => {
    try{
        const snapshot = await db.collection(collectionName).get();
        return snapshot.docs.map(doc => ({
            ... (doc.data() as T)
        }))

    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrieve the documents in ${collectionName}: ${errorMessage}`
        ) 
    }
}