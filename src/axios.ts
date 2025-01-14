import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { token, refresh_token } from "@/common/constants/auth";

// Create axios instance
export const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for different endpoints
const mockData = {
  tanks: [
    {
      id: "1",
      name: "Alpha",
      product: "Diesel",
      capacity: 5000,
      currentLevel: 15,
      lastDelivery: "2025-01-10",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Beta",
      product: "Petrol",
      capacity: 7000,
      currentLevel: 35,
      lastDelivery: "2025-01-08",
      status: "ACTIVE",
    },
    {
      id: "3",
      name: "Gamma",
      product: "Kerosene",
      capacity: 6000,
      currentLevel: 50,
      lastDelivery: "2025-01-07",
      status: "INACTIVE",
    },
    {
      id: "4",
      name: "Delta",
      product: "Diesel",
      capacity: 8000,
      currentLevel: 10,
      lastDelivery: "2025-01-05",
      status: "ACTIVE",
    },
    {
      id: "5",
      name: "Epsilon",
      product: "Petrol",
      capacity: 10000,
      currentLevel: 65,
      lastDelivery: "2025-01-04",
      status: "ACTIVE",
    },
  ],

  products: [
    {
      id: "1",
      name: "LPG Gas Cylinder 12.5kg",
      description: "Standard cooking gas cylinder",
      basePrice: 8500,
      price: 8500,
      status: "In Stock",
      allBranches: true,
      categoryId: "1",
      category: { id: "1", name: "Gas Cylinders" },
      branchPrices: []
    },
    {
      id: "2",
      name: "Engine Oil 4L",
      description: "Premium engine lubricant",
      basePrice: 12000,
      price: 12000,
      status: "In Stock",
      allBranches: true,
      categoryId: "2",
      category: { id: "2", name: "Lubricants" },
      branchPrices: []
    }
  ],
  "product-categories": [
    { id: "1", name: "Gas Cylinders", description: "Various gas cylinder sizes", createdAt: "2024-01-14" },
    { id: "2", name: "Lubricants", description: "Engine oils and lubricants", createdAt: "2024-01-14" },
    { id: "3", name: "Accessories", description: "Gas accessories", createdAt: "2024-01-14" }
  ],
  branches: [
    {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street",
      manager: "John Doe",
      phone: "+234123456789",
      email: "main@example.com",
      status: "active"
    },
    {
      id: "2",
      name: "Downtown Branch",
      address: "456 Downtown Ave",
      manager: "Jane Smith",
      phone: "+234987654321",
      email: "downtown@example.com",
      status: "active"
    }
  ],
  outlets: [
    {
      id: "1",
      name: "Main Outlet",
      location: "Lagos",
      branchId: "1",
      branch: { id: "1", name: "Main Branch" },
      manager: "Mike Johnson",
      phone: "+234111222333",
      email: "outlet1@example.com",
      status: "active"
    }
  ],
  "customer-products": [
    {
      id: "1",
      name: "LPG Gas Cylinder 12.5kg",
      price: 8500,
      quantity: 2,
      purchaseDate: "2024-01-14"
    }
  ],
  customers: [
    {
      id: "1",
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+234555666777",
      address: "789 Customer Street"
    }
  ],
  "fuel-products": [
    {
      id: "1",
      name: "Premium Motor Spirit",
      type: "PMS",
      price: 650,
      stock: 5000,
      status: "In Stock",
      tankId: "T001"
    },
    {
      id: "2",
      name: "Automotive Gas Oil",
      type: "AGO",
      price: 1200,
      stock: 3000,
      status: "In Stock",
      tankId: "T002"
    }
  ],
  lubricants: [
    {
      id: "1",
      name: "Premium Engine Oil",
      type: "Synthetic",
      viscosity: "5W-30",
      price: 12000,
      stock: 100,
      status: "In Stock"
    },
    {
      id: "2",
      name: "Basic Engine Oil",
      type: "Mineral",
      viscosity: "10W-40",
      price: 8000,
      stock: 150,
      status: "In Stock"
    }
  ]
};

// Intercept requests and return mock data
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("lpg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses and simulate API behavior
axiosClient.interceptors.response.use(
  (response) => {
    console.log("Mock API Response:", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(refresh_token);
        const response = await axios.post("/auth/refresh", {
          refresh_token: refreshToken,
        });

        const { token: newToken } = response.data;
        localStorage.setItem(token, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem(token);
        localStorage.removeItem(refresh_token);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Mock API functions with proper types
const mockGet = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: InternalAxiosRequestConfig
): Promise<R> => {
  console.log("Mock GET request to:", url);
  const endpoint = url.split("/").pop();

  const headers = new AxiosHeaders();

  if (mockData[endpoint]) {
    return {
      data: mockData[endpoint],
      status: 200,
      statusText: 'OK',
      headers,
      config: config || {} as InternalAxiosRequestConfig
    } as R;
  }

  // Handle specific IDs in URLs
  const urlParts = url.split("/");
  if (urlParts.length > 2) {
    const collection = urlParts[1];
    const id = urlParts[2];

    if (mockData[collection]) {
      const item = mockData[collection].find((item: any) => item.id === id);
      if (item) {
        return {
          data: item,
          status: 200,
          statusText: 'OK',
          headers,
          config: config || {} as InternalAxiosRequestConfig
        } as R;
      }
    }
  }

  throw new Error("Not found");
};

const mockPost = async <T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig
): Promise<R> => {
  console.log("Mock POST request to:", url, "with data:", data);
  const headers = new AxiosHeaders();

  return {
    data: { ...data, id: Math.random().toString() },
    status: 201,
    statusText: 'Created',
    headers,
    config: config || {} as InternalAxiosRequestConfig
  } as R;
};

const mockPut = async <T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: InternalAxiosRequestConfig
): Promise<R> => {
  console.log("Mock PUT request to:", url, "with data:", data);
  const headers = new AxiosHeaders();

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers,
    config: config || {} as InternalAxiosRequestConfig
  } as R;
};

const mockDelete = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: InternalAxiosRequestConfig
): Promise<R> => {
  console.log("Mock DELETE request to:", url);
  const headers = new AxiosHeaders();

  return {
    data: { success: true } as T,
    status: 200,
    statusText: 'OK',
    headers,
    config: config || {} as InternalAxiosRequestConfig
  } as R;
};

// Override axios methods with mock functions
axiosClient.get = mockGet;
axiosClient.post = mockPost;
axiosClient.put = mockPut;
axiosClient.delete = mockDelete;

export default axiosClient;