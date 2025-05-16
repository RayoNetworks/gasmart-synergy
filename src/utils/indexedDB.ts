
// IndexedDB utility for offline data storage

const DB_NAME = 'gasmart-synergy-db';
const DB_VERSION = 1;

// Store names
const PENDING_REQUESTS_STORE = 'pendingRequests';
const PRODUCTS_STORE = 'products';
const SALES_STORE = 'sales';
const CUSTOMERS_STORE = 'customers';

interface PendingRequest {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
}

interface StorableEntity {
  id: string | number;
  [key: string]: any;
}

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(PENDING_REQUESTS_STORE)) {
        db.createObjectStore(PENDING_REQUESTS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(SALES_STORE)) {
        db.createObjectStore(SALES_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(CUSTOMERS_STORE)) {
        db.createObjectStore(CUSTOMERS_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Add a pending request to be synced when online
export const addPendingRequest = async (request: PendingRequest): Promise<number> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_REQUESTS_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_REQUESTS_STORE);
    
    const addRequest = store.add({
      ...request,
      timestamp: Date.now()
    });
    
    addRequest.onsuccess = () => {
      resolve(addRequest.result as number);
    };
    
    addRequest.onerror = () => {
      reject(addRequest.error);
    };
  });
};

// Get all pending requests
export const getPendingRequests = async (): Promise<PendingRequest[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_REQUESTS_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_REQUESTS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Remove a pending request
export const removePendingRequest = async (id: number): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PENDING_REQUESTS_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_REQUESTS_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to add or update an entity in a store
export const saveEntity = async <T extends StorableEntity>(
  storeName: string, 
  entity: T
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(entity);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to get an entity from a store
export const getEntity = async <T>(
  storeName: string, 
  id: string | number
): Promise<T | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to get all entities from a store
export const getAllEntities = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to delete an entity from a store
export const deleteEntity = async (
  storeName: string, 
  id: string | number
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Save a product
export const saveProduct = (product: any) => saveEntity(PRODUCTS_STORE, product);

// Get all products
export const getAllProducts = () => getAllEntities(PRODUCTS_STORE);

// Get a product by ID
export const getProduct = (id: string) => getEntity(PRODUCTS_STORE, id);

// Delete a product
export const deleteProduct = (id: string) => deleteEntity(PRODUCTS_STORE, id);

// Save a sale
export const saveSale = (sale: any) => saveEntity(SALES_STORE, sale);

// Get all sales
export const getAllSales = () => getAllEntities(SALES_STORE);

// Get a sale by ID
export const getSale = (id: string) => getEntity(SALES_STORE, id);

// Delete a sale
export const deleteSale = (id: string) => deleteEntity(SALES_STORE, id);

// Save a customer
export const saveCustomer = (customer: any) => saveEntity(CUSTOMERS_STORE, customer);

// Get all customers
export const getAllCustomers = () => getAllEntities(CUSTOMERS_STORE);

// Get a customer by ID
export const getCustomer = (id: string) => getEntity(CUSTOMERS_STORE, id);

// Delete a customer
export const deleteCustomer = (id: string) => deleteEntity(CUSTOMERS_STORE, id);
