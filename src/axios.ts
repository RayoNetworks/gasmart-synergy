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
    },
    createdAt: "2024-03-15",
    status: "active"
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
    },
    createdAt: "2024-03-16",
    status: "active"
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
    },
    createdAt: "2024-03-17",
    status: "inactive"
  },
];

const mockProducts = [
  {
    id: "1",
    name: "LPG Cylinder 13kg",
    categoryId: "3",
    category: {
      id: "3",
      name: "LPG Products"
    },
    allBranches: false,
    basePrice: null,
    branchPrices: [
      { branchId: "1", price: "60.00", categoryId: "3" },
      { branchId: "2", price: "62.00", categoryId: "3" },
      { branchId: "3", price: "61.50", categoryId: "3" }
    ],
    variations: [
      {
        id: "1",
        type: "cooking_gas",
        name: "3kg Cylinder",
        allBranches: false,
        basePrice: null,
        branchPrices: [
          { branchId: "1", price: "25.00" },
          { branchId: "2", price: "26.00" },
          { branchId: "3", price: "25.50" }
        ]
      },
      {
        id: "2",
        type: "cooking_gas",
        name: "6kg Cylinder",
        allBranches: false,
        basePrice: null,
        branchPrices: [
          { branchId: "1", price: "35.00" },
          { branchId: "2", price: "36.00" },
          { branchId: "3", price: "35.50" }
        ]
      }
    ],
    stock: 48,
    status: "In Stock",
    price: 60.00
  },
  {
    id: "2",
    name: "Diesel",
    categoryId: "1",
    category: {
      id: "1",
      name: "Petroleum Products"
    },
    allBranches: true,
    basePrice: "550.50",
    branchPrices: [],
    variations: [
      {
        id: "1",
        type: "diesel",
        name: "Bulk Purchase (>1000L)",
        allBranches: true,
        basePrice: "540.00",
        branchPrices: []
      },
      {
        id: "2",
        type: "diesel",
        name: "Wholesale (>500L)",
        allBranches: true,
        basePrice: "545.00",
        branchPrices: []
      }
    ],
    stock: 2500,
    status: "In Stock",
    price: 550.50
  },
  {
    id: "3",
    name: "Petrol",
    categoryId: "1",
    category: {
      id: "1",
      name: "Petroleum Products"
    },
    allBranches: true,
    basePrice: "600.00",
    branchPrices: [],
    variations: [
      {
        id: "1",
        type: "petrol",
        name: "Bulk Purchase (>1000L)",
        allBranches: true,
        basePrice: "590.00",
        branchPrices: []
      }
    ],
    stock: 1800,
    status: "In Stock",
    price: 600.00
  }
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
    outletId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street, Lagos",
    },
    outlet: {
      id: "1",
      name: "Lagos Central Outlet",
      location: "Victoria Island, Lagos",
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
    outletId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
      address: "456 Marina Road, Port Harcourt",
    },
    outlet: {
      id: "2",
      name: "PH Waterfront Outlet",
      location: "Waterfront, Port Harcourt",
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
    outletId: "3",
    branch: {
      id: "3",
      name: "Abuja Branch",
      address: "789 Capital Way, Abuja",
    },
    outlet: {
      id: "3",
      name: "Abuja Central Outlet",
      location: "Central Business District, Abuja",
    },
    createdAt: "2024-02-10",
  },
];

const mockSales = [
  {
    id: 1,
    product: "LPG Cylinder 13kg",
    quantity: 2,
    amount: 120.00,
    date: "2024-03-20",
    status: "Completed",
    branch: {
      id: "1",
      name: "Main Branch",
    },
    user: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 123 4567",
    }
  },
  {
    id: 2,
    product: "Diesel",
    quantity: 50,
    amount: 275.50,
    date: "2024-03-20",
    status: "Completed",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
    },
    user: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 987 6543",
    }
  },
  {
    id: 3,
    product: "Petrol",
    quantity: 30,
    amount: 180.00,
    date: "2024-03-19",
    status: "Completed",
    branch: {
      id: "3",
      name: "Abuja Branch",
    },
    user: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 555 1234",
    }
  }
];

const mockSalesReturns = [
  {
    id: "1",
    productName: "LPG Cylinder 13kg",
    quantity: 1,
    returnDate: "2024-02-15",
    reason: "Defective valve",
    branchId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street, Lagos",
    }
  },
  {
    id: "2",
    productName: "Diesel",
    quantity: 20,
    returnDate: "2024-02-14",
    reason: "Contaminated fuel",
    branchId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
      address: "456 Marina Road, Port Harcourt",
    }
  },
];

const mockProductCategories = [
  {
    id: "1",
    name: "Petroleum Products",
    description: "Includes petrol, diesel, and kerosene",
    createdAt: "2024-02-15",
  },
  {
    id: "2",
    name: "Lubricants",
    description: "Engine oils and other lubricants",
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    name: "LPG Products",
    description: "Cooking gas and related accessories",
    createdAt: "2024-02-15",
  },
];

const mockOutlets = [
  {
    id: "1",
    name: "Lagos Central Outlet",
    location: "Victoria Island, Lagos",
    branchId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
    },
    manager: "John Smith",
    phone: "+234 801 234 5678",
    email: "lagos.central@example.com",
    status: "active",
  },
  {
    id: "2",
    name: "PH Waterfront Outlet",
    location: "Waterfront, Port Harcourt",
    branchId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
    },
    manager: "Sarah Johnson",
    phone: "+234 802 345 6789",
    email: "ph.waterfront@example.com",
    status: "active",
  },
  {
    id: "3",
    name: "Abuja Central Outlet",
    location: "Central Business District, Abuja",
    branchId: "3",
    branch: {
      id: "3",
      name: "Abuja Branch",
    },
    manager: "Michael Brown",
    phone: "+234 803 456 7890",
    email: "abuja.central@example.com",
    status: "inactive",
  },
];

const mockManagers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+234 801 234 5678",
    userType: "manager",
    managerType: "branch_manager",
    branchId: "1",
    branch: {
      id: "1",
      name: "Main Branch",
      address: "123 Main Street, Lagos",
    },
    createdAt: "2024-03-15",
    status: "active"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+234 802 345 6789",
    userType: "manager",
    managerType: "outlet_manager",
    outletId: "1",
    outlet: {
      id: "1",
      name: "Lagos Central Outlet",
      location: "Victoria Island, Lagos",
    },
    createdAt: "2024-03-16",
    status: "active"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+234 803 456 7890",
    userType: "manager",
    managerType: "branch_manager",
    branchId: "2",
    branch: {
      id: "2",
      name: "Port Harcourt Branch",
      address: "456 Marina Road, Port Harcourt",
    },
    createdAt: "2024-03-17",
    status: "active"
  }
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

    let mockResponse = { ...response };

    // Handle customers-related requests
    if (url?.startsWith('/customers')) {
      if (method === 'get') {
        if (url === '/customers') {
          console.log('Fetching all customers');
          mockResponse.data = mockCustomers;
        } else {
          const customerId = url.split('/')[2];
          console.log('Fetching customer with ID:', customerId);
          mockResponse.data = mockCustomers.find(customer => customer.id === customerId);
        }
      } else if (method === 'post') {
        console.log('Creating new customer:', response.config.data);
        const newCustomer = {
          id: (mockCustomers.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active',
          branch: mockBranches.find(
            branch => branch.id === JSON.parse(response.config.data).branchId
          ),
        };
        mockCustomers.push(newCustomer);
        mockResponse.data = newCustomer;
      } else if (method === 'put') {
        const customerId = url.split('/')[2];
        console.log('Updating customer with ID:', customerId);
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockCustomers[customerIndex] = {
            ...mockCustomers[customerIndex],
            ...updatedData,
            branch: mockBranches.find(b => b.id === updatedData.branchId),
          };
          mockResponse.data = mockCustomers[customerIndex];
        }
      } else if (method === 'delete') {
        const customerId = url.split('/')[2];
        console.log('Deleting customer with ID:', customerId);
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          mockCustomers.splice(customerIndex, 1);
          mockResponse.data = { message: "Customer deleted successfully" };
        }
      }
    }

    // Handle unassigned branches request
    if (url === "/branches" && method === "get") {
      const { hasManager } = response.config.params || {};
      if (hasManager === false) {
        mockResponse.data = mockBranches.filter(
          branch => !mockManagers.some(manager => 
            manager.managerType === "branch_manager" && manager.branchId === branch.id
          )
        );
      }
    }

    // Handle unassigned outlets request
    if (url === "/outlets" && method === "get") {
      const { hasManager } = response.config.params || {};
      if (hasManager === false) {
        mockResponse.data = mockOutlets.filter(
          outlet => !mockManagers.some(manager => 
            manager.managerType === "outlet_manager" && manager.outletId === outlet.id
          )
        );
      }
    }

    // Handle outlets requests
    if (url?.startsWith('/outlets')) {
      if (method === 'get') {
        if (url === '/outlets') {
          mockResponse.data = mockOutlets;
        } else {
          // Get single outlet
          const outletId = url.split('/')[2];
          mockResponse.data = mockOutlets.find(outlet => outlet.id === outletId);
        }
      } else if (method === 'post') {
        const newOutlet = {
          id: (mockOutlets.length + 1).toString(),
          ...JSON.parse(response.config.data),
          status: 'active',
          branch: mockBranches.find(
            branch => branch.id === JSON.parse(response.config.data).branchId
          ),
        };
        mockOutlets.push(newOutlet);
        mockResponse.data = newOutlet;
      } else if (method === 'put') {
        const outletId = url.split('/')[2];
        const outletIndex = mockOutlets.findIndex(outlet => outlet.id === outletId);
        
        if (outletIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockOutlets[outletIndex] = {
            ...mockOutlets[outletIndex],
            ...updatedData,
            branch: mockBranches.find(branch => branch.id === updatedData.branchId),
          };
          mockResponse.data = mockOutlets[outletIndex];
          console.log('Updated outlet:', mockOutlets[outletIndex]);
        }
      }
    }

    // Handle products requests
    if (url?.startsWith('/products')) {
      if (method === 'get') {
        mockResponse.data = mockProducts;
      } else if (method === 'post') {
        const newProduct = {
          id: (mockProducts.length + 1).toString(),
          ...JSON.parse(response.config.data),
          status: "In Stock",
          stock: 0,
          price: parseFloat(JSON.parse(response.config.data).allBranches 
            ? JSON.parse(response.config.data).basePrice 
            : JSON.parse(response.config.data).branchPrices[0]?.price || "0"),
          category: mockProductCategories.find(
            cat => cat.id === JSON.parse(response.config.data).categoryId
          )
        };
        mockProducts.push(newProduct);
        mockResponse.data = newProduct;
      }
    }

    // Handle sales requests
    if (url === "/sales") {
      mockResponse.data = mockSales;
    }

    // Handle sales returns requests
    if (url === "/sales-returns") {
      mockResponse.data = mockSalesReturns;
    }

    // Handle branch-related requests
    if (url?.startsWith("/branches")) {
      if (method === "get") {
        mockResponse.data =
          url === "/branches"
            ? mockBranches
            : mockBranches.find((b) => b.id === url.split("/")[2]);
      } else if (method === "post") {
        const newBranch = {
          id: (mockBranches.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          status: "active",
        };
        mockBranches.push(newBranch);
        mockResponse.data = newBranch;
      } else if (method === "put") {
        const branchId = url.split("/")[2];
        const index = mockBranches.findIndex((b) => b.id === branchId);
        if (index !== -1) {
          mockBranches[index] = {
            ...mockBranches[index],
            ...JSON.parse(response.config.data),
          };
          mockResponse.data = mockBranches[index];
        }
      } else if (method === "delete") {
        const branchId = url.split("/")[2];
        const index = mockBranches.findIndex((b) => b.id === branchId);
        if (index !== -1) {
          mockBranches.splice(index, 1);
          mockResponse.data = { message: "Branch deleted successfully" };
        }
      }
    }

    // Handle user-related requests
    if (url?.startsWith("/users")) {
      if (method === "get") {
        if (url === "/users") {
          const { userType, name, email, branch, outlet, createdAt } =
            response.config.params || {};
          let filteredUsers = [...mockUsers];

          if (userType)
            filteredUsers = filteredUsers.filter(
              (user) => user.userType === userType
            );
          if (name)
            filteredUsers = filteredUsers.filter((user) =>
              user.name.toLowerCase().includes(name.toLowerCase())
            );
          if (email)
            filteredUsers = filteredUsers.filter((user) =>
              user.email.toLowerCase().includes(email.toLowerCase())
            );
          if (branch)
            filteredUsers = filteredUsers.filter(
              (user) => user.branchId === branch
            );
          if (outlet)
            filteredUsers = filteredUsers.filter(
              (user) => user.outletId === outlet
            );
          if (createdAt)
            filteredUsers = filteredUsers.filter(
              (user) => user.createdAt === createdAt
            );

          mockResponse.data = filteredUsers;
        } else {
          const userId = url.split("/")[2];
          mockResponse.data = mockUsers.find((u) => u.id === userId);
        }
      } else if (method === "post") {
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          branch: mockBranches.find(
            (b) => b.id === JSON.parse(response.config.data).branchId
          ),
          outlet: mockOutlets.find(
            (o) => o.id === JSON.parse(response.config.data).outletId
          ),
        };
        mockUsers.push(newUser);
        mockResponse.data = newUser;
      } else if (method === "put") {
        const userId = url.split("/")[2];
        const userIndex = mockUsers.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          const updatedUser = {
            ...mockUsers[userIndex],
            ...JSON.parse(response.config.data),
            branch: mockBranches.find(
              (b) => b.id === JSON.parse(response.config.data).branchId
            ),
            outlet: mockOutlets.find(
              (o) => o.id === JSON.parse(response.config.data).outletId
            ),
          };
          mockUsers[userIndex] = updatedUser;
          mockResponse.data = updatedUser;
        }
      } else if (method === "delete") {
        const userId = url.split("/")[2];
        const userIndex = mockUsers.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          mockUsers.splice(userIndex, 1);
          mockResponse.data = { message: "User deleted successfully" };
        }
      }
    }

    // Handle customer products requests
    if (url?.startsWith("/customer-products")) {
      const customerId = url.split("/")[2];
      return { ...response, data: mockProducts };
    }

    // Handle product creation requests
    if (url === "/products") {
      if(method == 'get'){
        console.log('products')
       mockResponse.data = mockProducts;
      }
      if(method =='post'){
        const newProduct = {
          id: (mockProducts.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
        };
        mockProducts.push(newProduct);
        mockResponse.data = newProduct;
      }
    }

    // Handle product categories requests
    if (url?.startsWith("/product-categories")) {
      if (method === "get") {
        mockResponse.data = mockProductCategories;
        
      } else if (method === "post") {
        const newCategory = {
          id: (mockProductCategories.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
        };
        mockProductCategories.push(newCategory);
        mockResponse.data = newCategory;
      }
    }

    // Handle outlets requests
    if (url === "/outlets") {
      mockResponse.data = mockOutlets;
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
