import { addPendingRequest, saveEntity, getAllEntities } from './indexedDB';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Function to check if the user is online
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Generic fetch function with offline support
export const fetchWithOfflineSupport = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  storeOffline: boolean = true,
  storeName?: string
): Promise<T> => {
  // Construct the full URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Headers for the request
  const headers = {
    'Content-Type': 'application/json',
    // Add authorization header if needed
    ...getAuthHeaders(),
  };
  
  // Request options
  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  // Check if online
  if (isOnline()) {
    try {
      // If online, make the actual API request
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // If this was a successful write operation and we have a storeName,
      // update the local IndexedDB as well to keep it in sync
      if (['POST', 'PUT', 'PATCH'].includes(method) && storeName && responseData) {
        await saveEntity(storeName, responseData);
      }
      
      return responseData as T;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  } else if (storeOffline && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // If offline and this is a write operation, queue it for later
    console.log(`Offline: Queuing ${method} request to ${endpoint} for later sync`);
    
    await addPendingRequest({
      url,
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
      timestamp: Date.now(),
    });
    
    // Return a placeholder response if needed
    throw new Error('Currently offline. Request has been queued for later.');
  } else if (storeName && method === 'GET') {
    // If offline and this is a read operation, try to get from IndexedDB
    console.log(`Offline: Retrieving ${endpoint} data from IndexedDB`);
    
    // Get data from IndexedDB
    const localData = await getAllEntities<T>(storeName);
    
    // If we have data, return it
    if (localData && localData.length > 0) {
      return localData as unknown as T;
    }
    
    // If no data, throw an error
    throw new Error('Currently offline and no local data available.');
  } else {
    // If offline and we can't handle this request
    throw new Error('Currently offline. Cannot complete request.');
  }
};

// Function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('lpg_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Attempt to sync pending requests when online
export const syncPendingRequests = async (): Promise<void> => {
  if (isOnline() && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      await navigator.serviceWorker.ready;
      await navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_PENDING_REQUESTS'
      });
    } catch (error) {
      console.error('Failed to initiate sync:', error);
    }
  }
};

// Listen for online events to trigger sync
window.addEventListener('online', () => {
  console.log('Back online, syncing data...');
  syncPendingRequests();
});

// API Endpoints

// Products API
export const productsAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/products', 'GET', undefined, true, 'products'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/products/${id}`, 'GET', undefined, true, 'products'),
  create: (data: any) => fetchWithOfflineSupport<any>('/products', 'POST', data, true, 'products'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/products/${id}`, 'PUT', data, true, 'products'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/products/${id}`, 'DELETE', undefined, true, 'products'),
};

// Sales API
export const salesAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/sales', 'GET', undefined, true, 'sales'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/sales/${id}`, 'GET', undefined, true, 'sales'),
  create: (data: any) => fetchWithOfflineSupport<any>('/sales', 'POST', data, true, 'sales'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/sales/${id}`, 'PUT', data, true, 'sales'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/sales/${id}`, 'DELETE', undefined, true, 'sales'),
};

// Customer API
export const customersAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/customers', 'GET', undefined, true, 'customers'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/customers/${id}`, 'GET', undefined, true, 'customers'),
  create: (data: any) => fetchWithOfflineSupport<any>('/customers', 'POST', data, true, 'customers'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/customers/${id}`, 'PUT', data, true, 'customers'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/customers/${id}`, 'DELETE', undefined, true, 'customers'),
};

// Product Categories API
export const productCategoriesAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/product-categories', 'GET', undefined, true, 'product-categories'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/product-categories/${id}`, 'GET', undefined, true, 'product-categories'),
  create: (data: any) => fetchWithOfflineSupport<any>('/product-categories', 'POST', data, true, 'product-categories'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/product-categories/${id}`, 'PUT', data, true, 'product-categories'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/product-categories/${id}`, 'DELETE', undefined, true, 'product-categories'),
};

// Branches API
export const branchesAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/branches', 'GET', undefined, true, 'branches'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/branches/${id}`, 'GET', undefined, true, 'branches'),
  create: (data: any) => fetchWithOfflineSupport<any>('/branches', 'POST', data, true, 'branches'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/branches/${id}`, 'PUT', data, true, 'branches'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/branches/${id}`, 'DELETE', undefined, true, 'branches'),
};

// Outlets API
export const outletsAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/outlets', 'GET', undefined, true, 'outlets'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/outlets/${id}`, 'GET', undefined, true, 'outlets'),
  create: (data: any) => fetchWithOfflineSupport<any>('/outlets', 'POST', data, true, 'outlets'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/outlets/${id}`, 'PUT', data, true, 'outlets'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/outlets/${id}`, 'DELETE', undefined, true, 'outlets'),
};

// Tanks API
export const tanksAPI = {
  getAll: () => fetchWithOfflineSupport<any[]>('/tanks', 'GET', undefined, true, 'tanks'),
  getById: (id: string) => fetchWithOfflineSupport<any>(`/tanks/${id}`, 'GET', undefined, true, 'tanks'),
  create: (data: any) => fetchWithOfflineSupport<any>('/tanks', 'POST', data, true, 'tanks'),
  update: (id: string, data: any) => fetchWithOfflineSupport<any>(`/tanks/${id}`, 'PUT', data, true, 'tanks'),
  delete: (id: string) => fetchWithOfflineSupport<any>(`/tanks/${id}`, 'DELETE', undefined, true, 'tanks'),
};

// Discount API
export const discountAPI = {
  getProductDiscounts: () => fetchWithOfflineSupport<any[]>('/product-discounts', 'GET', undefined, true, 'product-discounts'),
  applyDiscount: (productId: string, data: any) => fetchWithOfflineSupport<any>(`/products/${productId}/discount`, 'POST', data, true, 'product-discounts'),
  removeDiscount: (productId: string) => fetchWithOfflineSupport<any>(`/products/${productId}/discount`, 'DELETE', undefined, true, 'product-discounts'),
};

// Unit Conversion API
export const conversionAPI = {
  getConversionRatio: () => fetchWithOfflineSupport<any>('/conversion-ratio', 'GET', undefined, true, 'conversion-ratio'),
  setConversionRatio: (data: any) => fetchWithOfflineSupport<any>('/conversion-ratio', 'POST', data, true, 'conversion-ratio'),
};

// Analytics API
export const analyticsAPI = {
  getSalesSummary: () => fetchWithOfflineSupport<any>('/analytics/sales-summary', 'GET', undefined, true, 'analytics-sales-summary'),
  getRevenueByProduct: () => fetchWithOfflineSupport<any>('/analytics/revenue-by-product', 'GET', undefined, true, 'analytics-revenue-by-product'),
  getRevenueByBranch: () => fetchWithOfflineSupport<any>('/analytics/revenue-by-branch', 'GET', undefined, true, 'analytics-revenue-by-branch'),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params: any) => fetchWithOfflineSupport<any>('/reports/sales', 'GET', params, true, 'reports-sales'),
  getInventoryReport: (params: any) => fetchWithOfflineSupport<any>('/reports/inventory', 'GET', params, true, 'reports-inventory'),
  getCustomerReport: (params: any) => fetchWithOfflineSupport<any>('/reports/customers', 'GET', params, true, 'reports-customers'),
};
