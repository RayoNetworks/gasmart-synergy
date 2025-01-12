import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  refresh_token as refreshToken,
  token as Token,
} from "./common/constants/auth";

// Mock data
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 123 4567",
    address: "123 Main St, Lagos",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 987 6543",
    address: "456 Oak Ave, Abuja",
  },
  {
    id: "3",
    name: "Timothy Avell",
    email: "tim@example.com",
    phone: "+234 555 1234",
    address: "789 Pine Rd, Port Harcourt",
  },
];

const mockProducts = [
  {
    id: "1",
    name: "LPG Cylinder 13kg",
    price: 60.00,
    quantity: 2,
    purchaseDate: "2024-02-15",
  },
  {
    id: "2",
    name: "Diesel",
    price: 550.50,
    quantity: 100,
    purchaseDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Petrol",
    price: 600.00,
    quantity: 50,
    purchaseDate: "2024-02-01",
  },
];

// Create axios instance
export const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock API interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem(Token) ?? "";
    const refresh_token = localStorage.getItem(refreshToken) ?? "";
    config.headers.Authorization = `Bearer ${token} ${refresh_token}`;
    return config;
  }
);

// Mock API response interceptor
axiosClient.interceptors.response.use(
  async (response: AxiosResponse<any, any>) => {
    // Mock API endpoints
    const url = response.config.url;
    const method = response.config.method;

    if (url?.startsWith('/customers')) {
      if (method === 'get') {
        if (url === '/customers') {
          return { data: mockCustomers };
        }
        const customerId = url.split('/')[2];
        const customer = mockCustomers.find(c => c.id === customerId);
        return { data: customer };
      }
      if (method === 'put') {
        const customerId = url.split('/')[2];
        const updatedCustomer = response.config.data;
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...JSON.parse(updatedCustomer) };
          return { data: mockCustomers[customerIndex] };
        }
      }
      if (method === 'delete') {
        const customerId = url.split('/')[2];
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          mockCustomers.splice(customerIndex, 1);
          return { data: { message: 'Customer deleted successfully' } };
        }
      }
    }

    if (url?.startsWith('/customer-products')) {
      const customerId = url.split('/')[2];
      return { data: mockProducts };
    }

    return response;
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