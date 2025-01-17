import { v4 as uuidv4 } from 'uuid';
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
  managers: [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      managerType: "branch_manager",
      branch: { id: "101", name: "Downtown Branch" },
      outlet: null,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "234-567-8901",
      managerType: "outlet_manager",
      branch: null,
      outlet: { id: "201", name: "Central Outlet" },
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      phone: "345-678-9012",
      managerType: "branch_manager",
      branch: { id: "102", name: "Uptown Branch" },
      outlet: null,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "456-789-0123",
      managerType: "outlet_manager",
      branch: null,
      outlet: { id: "202", name: "Eastside Outlet" },
    },
    {
      id: "5",
      name: "William Brown",
      email: "william.brown@example.com",
      phone: "567-890-1234",
      managerType: "branch_manager",
      branch: { id: "103", name: "Westside Branch" },
      outlet: null,
    },
  ],
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      userType: "staff",
      branch: {
        id: "101",
        name: "Main Branch",
      },
      outlet: {
        id: "201",
        name: "Downtown Outlet",
      },
      createdAt: "2024-01-01T08:00:00.000Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "9876543210",
      userType: "customer",
      branch: null, // No branch assigned
      outlet: {
        id: "202",
        name: "Uptown Outlet",
      },
      createdAt: "2024-01-05T10:30:00.000Z",
    },
    {
      id: "3",
      name: "Samuel Green",
      email: "samuelgreen@example.com",
      phone: "5678901234",
      userType: "working_client",
      branch: {
        id: "102",
        name: "West Side Branch",
      },
      outlet: {
        id: "203",
        name: "Westside Outlet",
      },
      createdAt: "2023-12-15T09:00:00.000Z",
    },
    {
      id: "4",
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      phone: "7654321098",
      userType: "staff",
      branch: {
        id: "103",
        name: "East Side Branch",
      },
      outlet: null, // No outlet assigned
      createdAt: "2023-11-20T14:00:00.000Z",
    },
  ],
  audit: [
    {
      id: "1",
      transactionId: "TXN12345",
      date: "2025-01-15T08:30:00Z",
      amount: 5000.0,
      cashier: "John Doe",
      status: "verified",
      discrepancies: null,
    },
    {
      id: "2",
      transactionId: "TXN12346",
      date: "2025-01-15T10:15:00Z",
      amount: 7000.5,
      cashier: "Jane Smith",
      status: "unverified",
      discrepancies: "Amount mismatch",
    },
    {
      id: "3",
      transactionId: "TXN12347",
      date: "2025-01-14T14:45:00Z",
      amount: 4500.0,
      cashier: "Chris Lee",
      status: "verified",
      discrepancies: null,
    },
    {
      id: "4",
      transactionId: "TXN12348",
      date: "2025-01-13T09:00:00Z",
      amount: 15000.75,
      cashier: "Taylor Brown",
      status: "unverified",
      discrepancies: "Missing receipt",
    },
    {
      id: "5",
      transactionId: "TXN12349",
      date: "2025-01-12T12:00:00Z",
      amount: 2000.0,
      cashier: "Alex Wilson",
      status: "verified",
      discrepancies: null,
    },
  ],
  "sales-returns": [
    {
      id: "1",
      productName: "LPG Gas Cylinder 12.5kg",
      quantity: 1,
      returnDate: "2025-01-10",
      reason: "Damaged on delivery",
      branchId: "101",
      outletId: "501",
      branch: {
        id: "101",
        name: "Main Branch",
        address: "123 Main Street, Lagos",
      },
      outlet: {
        id: "501",
        name: "Central Outlet",
        location: "Victoria Island, Lagos",
      },
      user: {
        id: "201",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+2347012345678",
        role: "Cashier",
      },
    },
    {
      id: "2",
      productName: "Engine Oil 4L",
      quantity: 2,
      returnDate: "2025-01-11",
      reason: "Wrong product delivered",
      branchId: "102",
      outletId: "502",
      branch: {
        id: "102",
        name: "North Branch",
        address: "456 Northern Road, Abuja",
      },
      outlet: {
        id: "502",
        name: "North Outlet",
        location: "Wuse 2, Abuja",
      },
      user: {
        id: "202",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+2348098765432",
        role: "Cashier",
      },
    },
    {
      id: "3",
      productName: "Cooking Oil 5L",
      quantity: 3,
      returnDate: "2025-01-12",
      reason: "Expired product",
      branchId: "103",
      outletId: "503",
      branch: {
        id: "103",
        name: "East Branch",
        address: "789 Eastern Ave, Enugu",
      },
      outlet: {
        id: "503",
        name: "East Outlet",
        location: "Ogui Road, Enugu",
      },
      user: {
        id: "203",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "+2347033334444",
        role: "Cashier",
      },
    },
    {
      id: "4",
      productName: "Petrol Can 10L",
      quantity: 1,
      returnDate: "2025-01-13",
      reason: "Leakage detected",
      branchId: "104",
      outletId: "504",
      branch: {
        id: "104",
        name: "West Branch",
        address: "321 Western Blvd, Port Harcourt",
      },
      outlet: {
        id: "504",
        name: "West Outlet",
        location: "GRA Phase 2, Port Harcourt",
      },
      user: {
        id: "204",
        name: "Bob Brown",
        email: "bob.brown@example.com",
        phone: "+2348067890123",
        role: "Cashier",
      },
    },
    {
      id: "5",
      productName: "Charcoal Bag 25kg",
      quantity: 5,
      returnDate: "2025-01-14",
      reason: "Customer dissatisfaction",
      branchId: "105",
      outletId: null, // No outlet associated
      branch: {
        id: "105",
        name: "South Branch",
        address: "654 Southern Lane, Calabar",
      },
      outlet: null, // No outlet information
      user: {
        id: "205",
        name: "Eve White",
        email: "eve.white@example.com",
        phone: "+2348076543210",
        role: "Cashier",
      },
    },
  ],
  sales: [
    {
      id: "1",
      product: "LPG Gas Cylinder 12.5kg",
      branch: { id: "101", name: "Main Branch" },
      outlet: { id: "501", name: "Central Outlet" },
      user: { id: "201", name: "John Doe", email: "john.doe@example.com" },
      quantity: 2,
      amount: 17000,
      date: "2025-01-14",
      status: "Completed",
    },
    {
      id: "2",
      product: "Engine Oil 4L",
      branch: { id: "102", name: "North Branch" },
      outlet: { id: "502", name: "North Outlet" },
      user: { id: "202", name: "Jane Smith", email: "jane.smith@example.com" },
      quantity: 1,
      amount: 12000,
      date: "2025-01-13",
      status: "Completed",
    },
    {
      id: "3",
      product: "Cooking Oil 5L",
      branch: { id: "103", name: "East Branch" },
      outlet: null, // No outlet associated
      user: { id: "203", name: "Alice Johnson", email: "alicejohnson@example.com" },
      quantity: 5,
      amount: 25000,
      date: "2025-01-12",
      status: "Pending",
    },
    {
      id: "4",
      product: "Petrol Can 10L",
      branch: { id: "104", name: "West Branch" },
      outlet: { id: "503", name: "West Outlet" },
      user: { id: "204", name: "Bob Brown", email: "bob.brown@example.com" },
      quantity: 3,
      amount: 21000,
      date: "2025-01-11",
      status: "Completed",
    },
    {
      id: "5",
      product: "Charcoal Bag 25kg",
      branch: { id: "105", name: "South Branch" },
      outlet: null,
      user: { id: "205", name: "Eve White", email: "eve.white@example.com" },
      quantity: 10,
      amount: 40000,
      date: "2025-01-10",
      status: "Cancelled",
    },
  ],
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
      branchPrices: [],
      variations: [
        {
          id: "1-1",
          type: "Accessory",
          name: "With Hose",
          allBranches: true,
          basePrice: 9000,
          branchPrices: [],
        },
        {
          id: "1-2",
          type: "Accessory",
          name: "Without Hose",
          allBranches: true,
          basePrice: 8500,
          branchPrices: [],
        },
      ],
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
      branchPrices: [],
      variations: [
        {
          id: "2-1",
          type: "Type",
          name: "Synthetic",
          allBranches: true,
          basePrice: 13000,
          branchPrices: [],
        },
        {
          id: "2-2",
          type: "Type",
          name: "Semi-Synthetic",
          allBranches: true,
          basePrice: 12500,
          branchPrices: [],
        },
      ],
    },
    {
      id: "3",
      name: "Cooking Oil 5L",
      description: "Healthy cooking oil",
      basePrice: 5000,
      price: 5000,
      status: "In Stock",
      allBranches: true,
      categoryId: "3",
      category: { id: "3", name: "Cooking Supplies" },
      branchPrices: [],
      variations: [],
    },
    {
      id: "4",
      name: "Petrol Can 10L",
      description: "High-quality petrol",
      basePrice: 7000,
      price: 7000,
      status: "Out of Stock",
      allBranches: false,
      categoryId: "4",
      category: { id: "4", name: "Fuel" },
      branchPrices: [
        { branchId: "1", price: 7100 },
        { branchId: "2", price: 7050 },
      ],
      variations: [
        {
          id: "4-1",
          type: "Grade",
          name: "Regular Petrol",
          allBranches: false,
          basePrice: 7000,
          branchPrices: [
            { branchId: "1", price: 7100 },
            { branchId: "2", price: 7050 },
          ],
        },
        {
          id: "4-2",
          type: "Grade",
          name: "Premium Petrol",
          allBranches: false,
          basePrice: 7500,
          branchPrices: [
            { branchId: "1", price: 7600 },
            { branchId: "2", price: 7550 },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Charcoal Bag 25kg",
      description: "Eco-friendly charcoal for cooking",
      basePrice: 4000,
      price: 4000,
      status: "In Stock",
      allBranches: true,
      categoryId: "5",
      category: { id: "5", name: "Solid Fuels" },
      branchPrices: [],
      variations: [],
    },
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

//ensure that id for all mock data is always unique
Object.keys(mockData).forEach(key => {
  if (Array.isArray(mockData[key])) {
    mockData[key].forEach((item: any) => {
      item.id = uuidv4();
    });
  }
});




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

  const endpoint = url.split("/").pop();

  mockData[endpoint] = [{ ...data, id: Math.random().toString() }, ...mockData[endpoint]];


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

  const headers = new AxiosHeaders();
  const requestPaths = url.split('/')




  const id = requestPaths.pop();
  const endpoint = requestPaths.pop();

  // console.log("Mock PUT request to:", url, "with data:", data);


  mockData[endpoint] = mockData[endpoint].map((item: any) => {
    if (item.id === id) {
      return { ...item, ...data }
    };
    return item;
  })



  return {
    data,
    status: 200,
    statusText: 'OK',
    headers,
    config: config || {} as InternalAxiosRequestConfig
  } as R;
};

//ensure delete button uses this function to delete mockData
const mockDelete = async <T = any, R = AxiosResponse<T>>(
  url: string,
  config?: InternalAxiosRequestConfig
): Promise<R> => {
  console.log("Mock DELETE request to:", url);
  
  const headers = new AxiosHeaders();
  const requestPaths = url.split('/');
  const id = requestPaths.pop();
  const endpoint = requestPaths.pop();

  mockData[endpoint] = mockData[endpoint].filter((item: any) => item.id !== id);

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
