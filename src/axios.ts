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
    branchId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street, Lagos",
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 987 6543",
    address: "456 Oak Ave, Abuja",
    branchId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
      address: "456 Marina Road, Port Harcourt",
    }
  },
  {
    id: "3",
    name: "Timothy Avell",
    email: "tim@example.com",
    phone: "+234 555 1234",
    address: "789 Pine Rd, Port Harcourt",
    branchId: "3",
    branch: {
      id: "3",
      name: "Abuja Branch",
      address: "789 Capital Way, Abuja",
    }
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

const mockBranches = [
  {
    id: "1",
    name: "Main Branch",
    address: "123 Main Street, Lagos",
    phone: "+234 801 234 5678",
    email: "main@example.com",
    manager: "John Doe",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Port Harcourt Branch",
    address: "456 Marina Road, Port Harcourt",
    phone: "+234 802 345 6789",
    email: "ph@example.com",
    manager: "Jane Smith",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Abuja Branch",
    address: "789 Capital Way, Abuja",
    phone: "+234 803 456 7890",
    email: "abuja@example.com",
    manager: "Mike Johnson",
    status: "inactive",
    createdAt: "2024-02-10",
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 123 4567",
    userType: "customer",
    branchId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street, Lagos",
    },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+234 987 6543",
    userType: "working_client",
    branchId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
      address: "456 Marina Road, Port Harcourt",
    },
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+234 555 1234",
    userType: "staff",
    branchId: "3",
    branch: {
      id: "3",
      name: "Abuja Branch",
      address: "789 Capital Way, Abuja",
    },
    createdAt: "2024-02-10",
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
    const url = response.config.url;
    const method = response.config.method;

    // Handle branch-related requests
    if (url?.startsWith('/branches')) {
      if (method === 'get') {
        if (url === '/branches') {
          return { ...response, data: mockBranches };
        }
        const branchId = url.split('/')[2];
        const branch = mockBranches.find(b => b.id === branchId);
        return { ...response, data: branch };
      }
      if (method === 'post') {
        const newBranch = {
          id: (mockBranches.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        mockBranches.push(newBranch);
        return { ...response, data: newBranch };
      }
      if (method === 'put') {
        const branchId = url.split('/')[2];
        const updatedBranch = JSON.parse(response.config.data);
        const index = mockBranches.findIndex(b => b.id === branchId);
        if (index !== -1) {
          mockBranches[index] = { ...mockBranches[index], ...updatedBranch };
          return { ...response, data: mockBranches[index] };
        }
      }
      if (method === 'delete') {
        const branchId = url.split('/')[2];
        const index = mockBranches.findIndex(b => b.id === branchId);
        if (index !== -1) {
          mockBranches.splice(index, 1);
          return { ...response, data: { message: 'Branch deleted successfully' } };
        }
      }
    }

    // Handle customer-related requests
    if (url?.startsWith('/customers')) {
      if (method === 'get') {
        if (url === '/customers') {
          return { ...response, data: mockCustomers };
        }
        const customerId = url.split('/')[2];
        const customer = mockCustomers.find(c => c.id === customerId);
        return { ...response, data: customer };
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

    // Handle user-related requests
    if (url?.startsWith('/users')) {
      if (method === 'get') {
        const { userType, name, email, branch, createdAt } = response.config.params || {};
        let filteredUsers = [...mockUsers];
        
        if (userType) {
          filteredUsers = filteredUsers.filter(user => user.userType === userType);
        }
        if (name) {
          filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (email) {
          filteredUsers = filteredUsers.filter(user => 
            user.email.toLowerCase().includes(email.toLowerCase())
          );
        }
        if (branch) {
          filteredUsers = filteredUsers.filter(user => user.branchId === branch);
        }
        if (createdAt) {
          filteredUsers = filteredUsers.filter(user => user.createdAt === createdAt);
        }
        
        return { ...response, data: filteredUsers };
      }
      if (method === 'post') {
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split('T')[0],
          branch: mockBranches.find(b => b.id === JSON.parse(response.config.data).branchId)
        };
        mockUsers.push(newUser);
        return { ...response, data: newUser };
      }
      if (method === 'delete') {
        const userId = url.split('/')[2];
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          mockUsers.splice(userIndex, 1);
          return { ...response, data: { message: 'User deleted successfully' } };
        }
      }
    }

    // Handle customer products requests
    if (url?.startsWith('/customer-products')) {
      const customerId = url.split('/')[2];
      return { ...response, data: mockProducts };
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
