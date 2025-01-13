import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  refresh_token as refreshToken,
  token as Token,
} from "./common/constants/auth";
import { mockTanks } from "./mocks/tankData";

// Create axios instance
export const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

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