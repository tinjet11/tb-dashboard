import { Models, Permission } from "appwrite";
import { ID } from "appwrite";
import { databases } from "./config";

// Define types for the environment variables if not already defined
const dbId: string = import.meta.env.VITE_DATABASE_ID as string;
const hospitalCollectionId: string = import.meta.env
  .VITE_COLLECTION_ID_HOSPITAL as string;

// Define the structure of collections
interface Collection {
  dbId: string;
  id: string;
  name: string;
}

const collections: Collection[] = [
  {
    dbId: dbId,
    id: hospitalCollectionId,
    name: "Hospital",
  },
];

// Define types for CRUD functions
interface DatabaseFunctions {
  create: (
    payload: any,
    id?: string,
    permissions?: Permission[]
  ) => Promise<Models.Document>;
  update: (
    id: string,
    payload: any,
    permissions?: Permission[]
  ) => Promise<Models.Document>;
  delete: (id: string) => Promise<{}>;
  list: (queries?: string[]) => Promise<Models.DocumentList<Models.Document>>;
  get: (id: string) => Promise<Models.Document>;
}

// Initialize the `db` object with proper types
const db: Record<string, DatabaseFunctions> = {};

collections.forEach((col) => {
  db[col.name] = {
    create: (payload, id = ID.unique()) =>
      databases.createDocument(col.dbId, col.id, id, payload),
    update: (id, payload) =>
      databases.updateDocument(col.dbId, col.id, id, payload),
    delete: (id) => databases.deleteDocument(col.dbId, col.id, id),
    list: (queries = []) => databases.listDocuments(col.dbId, col.id, queries),
    get: (id) => databases.getDocument(col.dbId, col.id, id),
  };
});

export default db;
