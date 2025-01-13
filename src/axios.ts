import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  refresh_token as refreshToken,
  token as Token,
} from "./common/constants/auth";

// Create axios instance
export const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for tanks
const mockTanks = [
  {
    id: "TNK001",
    name: "Tank 01",
    product: "Premium Motor Spirit",
    capacity: 50000,
    currentLevel: 75,
    lastDelivery: "2024-03-15",
    status: "ACTIVE",
    deliveryLogs: [
      {
        id: "DL001",
        date: "2024-03-15",
        quantity: 25000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED"
      },
      {
        id: "DL002",
        date: "2024-03-10",
        quantity: 30000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED"
      }
    ]
  },
  {
    id: "TNK002",
    name: "Tank 02",
    product: "Automotive Gas Oil",
    capacity: 40000,
    currentLevel: 45,
    lastDelivery: "2024-03-12",
    status: "ACTIVE",
    deliveryLogs: [
      {
        id: "DL003",
        date: "2024-03-12",
        quantity: 20000,
        supplier: "FuelMasters Co",
        productType: "Automotive Gas Oil",
        status: "COMPLETED"
      }
    ]
  }
];

// Mock data for lubricants
const mockLubricants = [
  {
    id: "LUB001",
    name: "Premium Engine Oil",
    type: "Engine Oil",
    viscosity: "SAE 40",
    price: 5000,
    stock: 150,
    status: "In Stock",
  },
  {
    id: "LUB002",
    name: "Brake Fluid",
    type: "Brake Oil",
    viscosity: "DOT 4",
    price: 2500,
    stock: 50,
    status: "Low Stock",
  },
  {
    id: "LUB003",
    name: "Transmission Fluid",
    type: "Transmission Oil",
    viscosity: "ATF",
    price: 3500,
    stock: 0,
    status: "Out of Stock",
  }
];

// Mock data for fuel products
const mockFuelProducts = [
  {
    id: "FUEL001",
    name: "Premium Motor Spirit",
    type: "PMS",
    price: 617,
    stock: 5000,
    status: "In Stock",
    tankId: "TNK001",
  },
  {
    id: "FUEL002",
    name: "Automotive Gas Oil",
    type: "Diesel",
    price: 950,
    stock: 3000,
    status: "In Stock",
    tankId: "TNK002",
  },
  {
    id: "FUEL003",
    name: "Dual Purpose Kerosene",
    type: "DPK",
    price: 800,
    stock: 100,
    status: "Low Stock",
    tankId: "TNK003",
  }
];

// Mock data for auth
const mockUsers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "admin@example.com",
    role: "ADMIN",
    priviledges: "*"
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "manager@example.com",
    role: "MANAGER",
    priviledges: ["VIEW_REPORTS", "MANAGE_INVENTORY"]
  }
];

// Mock API interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem(Token) ?? "";
    const refresh_token = localStorage.getItem(refreshToken) ?? "";
    config.headers.Authorization = `Bearer ${token} ${refresh_token}`;
    console.log("Making request to:", config.url);
    return config;
  }
);

// Mock API response interceptor
axiosClient.interceptors.response.use(
  async (response: AxiosResponse<any, any>) => {
    const url = response.config.url;
    const method = response.config.method;

    let mockResponse = { ...response };
    console.log("Mocking response for URL:", url);

    // Handle tanks requests
    if (url === "/tanks") {
      console.log("Mocking tanks response with data:", mockTanks);
      mockResponse.data = mockTanks;
    }

    // Handle lubricants requests
    if (url === "/lubricants") {
      console.log("Mocking lubricants response with data:", mockLubricants);
      mockResponse.data = mockLubricants;
    }

    // Handle fuel products requests
    if (url === "/fuel-products") {
      console.log("Mocking fuel products response with data:", mockFuelProducts);
      mockResponse.data = mockFuelProducts;
    }

    // Handle auth requests
    if (url === "/auth/logged-in") {
      const token = localStorage.getItem(Token);
      if (token) {
        mockResponse.data = {
          user: mockUsers[0] // Default to admin user for testing
        };
      } else {
        mockResponse.status = 401;
        throw new Error("Unauthorized");
      }
    }

    if (url === "/auth/login") {
      mockResponse.data = {
        token: "mock-token-12345",
        refresh_token: "mock-refresh-token-12345",
        user: mockUsers[0]
      };
    }

    return mockResponse;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const { data } = await axiosClient.get(`/auth/refresh`);
        const { token } = data;
        localStorage.setItem(Token, token);
        return axiosClient(error.config);
      } catch (error) {
        localStorage.removeItem(Token);
        localStorage.removeItem(refreshToken);
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);