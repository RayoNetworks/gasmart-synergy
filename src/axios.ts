import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  refresh_token as refreshToken,
  token as Token,
} from "./common/constants/auth";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for branches
const mockBranches = [
  {
    id: "BR001",
    name: "Main Branch",
    address: "123 Main Street",
    city: "Lagos",
    state: "Lagos State",
    phone: "08012345678",
    email: "main.branch@example.com",
    manager: "James Wilson",
    status: "active",
    createdAt: "2024-03-01",
    totalSales: 1500000,
    totalProducts: 25,
    totalStaff: 15
  },
  {
    id: "BR002",
    name: "East Branch",
    address: "45 East Road",
    city: "Port Harcourt",
    state: "Rivers State",
    phone: "08087654321",
    email: "east.branch@example.com",
    manager: "Sarah Johnson",
    status: "active",
    createdAt: "2024-03-05",
    totalSales: 1200000,
    totalProducts: 20,
    totalStaff: 12
  },
  {
    id: "BR003",
    name: "North Branch",
    address: "78 Northern Way",
    city: "Kano",
    state: "Kano State",
    phone: "08023456789",
    email: "north.branch@example.com",
    manager: "Ahmed Mohammed",
    status: "active",
    createdAt: "2024-03-10",
    totalSales: 900000,
    totalProducts: 18,
    totalStaff: 10
  }
];

const mockOutlets = [
  {
    id: "OUT001",
    name: "Main Street Outlet",
    location: "124 Main Street",
    branchId: "BR001",
    status: "active",
    phone: "08011112222",
    email: "main.outlet@example.com",
    manager: "John Smith",
    totalSales: 500000,
    totalProducts: 15,
    createdAt: "2024-03-01",
    branch: mockBranches[0]
  },
  {
    id: "OUT002",
    name: "Downtown Outlet",
    location: "45 Downtown Road",
    branchId: "BR001",
    status: "active",
    phone: "08033334444",
    email: "downtown.outlet@example.com",
    manager: "Mary Johnson",
    totalSales: 450000,
    totalProducts: 12,
    createdAt: "2024-03-02",
    branch: mockBranches[0]
  },
  {
    id: "OUT003",
    name: "East Road Outlet",
    location: "46 East Road",
    branchId: "BR002",
    status: "active",
    phone: "08055556666",
    email: "east.outlet@example.com",
    manager: "Peter Brown",
    totalSales: 400000,
    totalProducts: 10,
    createdAt: "2024-03-03",
    branch: mockBranches[1]
  },
  {
    id: "OUT004",
    name: "Harbor Outlet",
    location: "12 Harbor View",
    branchId: "BR002",
    status: "active",
    phone: "08077778888",
    email: "harbor.outlet@example.com",
    manager: "Lisa Davis",
    totalSales: 350000,
    totalProducts: 8,
    createdAt: "2024-03-04",
    branch: mockBranches[1]
  }
];

// Mock data for managers
const mockManagers = [
  {
    id: "MGR001",
    name: "James Wilson",
    email: "james@example.com",
    phone: "08012345678",
    managerType: "branch_manager",
    branchId: "BR001",
    status: "active",
    createdAt: "2024-03-01",
    performance: 95,
    totalSales: 1500000,
    branch: mockBranches[0]
  },
  {
    id: "MGR002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "08087654321",
    managerType: "outlet_manager",
    outletId: "OUT001",
    status: "active",
    createdAt: "2024-03-02",
    performance: 92,
    totalSales: 500000,
    outlet: mockOutlets[0]
  },
  {
    id: "MGR003",
    name: "Ahmed Mohammed",
    email: "ahmed@example.com",
    phone: "08023456789",
    managerType: "branch_manager",
    branchId: "BR003",
    status: "active",
    createdAt: "2024-03-03",
    performance: 88,
    totalSales: 900000,
    branch: mockBranches[2]
  }
];

// Mock data for product categories
const mockProductCategories = [
  {
    id: "CAT001",
    name: "Fuels",
    description: "Various types of fuel products",
    status: "active",
    totalProducts: 5,
    createdAt: "2024-03-01"
  },
  {
    id: "CAT002",
    name: "Lubricants",
    description: "Engine oils and other lubricants",
    status: "active",
    totalProducts: 8,
    createdAt: "2024-03-02"
  },
  {
    id: "CAT003",
    name: "Accessories",
    description: "Vehicle accessories and parts",
    status: "active",
    totalProducts: 12,
    createdAt: "2024-03-03"
  }
];

// Mock data for products
const mockProducts = [
  {
    id: "PRD001",
    name: "Premium Motor Spirit",
    categoryId: "CAT001",
    description: "High-quality fuel for vehicles",
    basePrice: 617,
    price: 617,
    allBranches: true,
    status: "In Stock",
    stock: 1000,
    category: mockProductCategories[0],
    branchPrices: [],
    totalSales: 50000,
    createdAt: "2024-03-01",
    branch: null,
    outlet: null
  },
  {
    id: "PRD002",
    name: "Engine Oil",
    categoryId: "CAT002",
    description: "Premium engine lubricant",
    basePrice: 5000,
    price: 5000,
    allBranches: false,
    branchPrices: [
      { branchId: "BR001", price: 5000 },
      { branchId: "BR002", price: 5200 }
    ],
    status: "In Stock",
    stock: 500,
    totalSales: 25000,
    createdAt: "2024-03-02",
    category: mockProductCategories[1],
    branch: mockBranches[0],
    outlet: mockOutlets[0]
  },
  {
    id: "PRD003",
    name: "Diesel Fuel",
    categoryId: "CAT001",
    description: "High-performance diesel fuel",
    basePrice: 800,
    price: 800,
    allBranches: false,
    branchPrices: [
      { branchId: "BR001", price: 800 }
    ],
    status: "Low Stock",
    stock: 100,
    totalSales: 15000,
    createdAt: "2024-03-03",
    category: mockProductCategories[0],
    branch: mockBranches[0],
    outlet: mockOutlets[0]
  }
];

// Mock data for customers
const mockCustomers = [
  {
    id: "CUS001",
    name: "John Smith",
    email: "john@example.com",
    phone: "08011223344",
    address: "123 Customer Street",
    branchId: "BR001",
    outletId: "OUT001",
    status: "active",
    createdAt: "2024-03-01",
    totalPurchases: 150000,
    lastPurchase: "2024-03-15",
    branch: mockBranches[0],
    outlet: mockOutlets[0]
  },
  {
    id: "CUS002",
    name: "Mary Johnson",
    email: "mary@example.com",
    phone: "08055667788",
    address: "456 Customer Avenue",
    branchId: "BR002",
    outletId: "OUT003",
    status: "active",
    createdAt: "2024-03-02",
    totalPurchases: 120000,
    lastPurchase: "2024-03-14",
    branch: mockBranches[1],
    outlet: mockOutlets[2]
  }
];

// Mock data for sales
const mockSales = [
  {
    id: "SL001",
    product: "Premium Motor Spirit",
    quantity: 50,
    amount: 30850,
    date: "2024-03-15",
    status: "completed",
    paymentMethod: "cash",
    branch: mockBranches[0],
    outlet: mockOutlets[0],
    customer: mockCustomers[0],
    user: {
      id: "USR001",
      name: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "SL002",
    product: "Engine Oil",
    quantity: 5,
    amount: 25000,
    date: "2024-03-14",
    status: "completed",
    paymentMethod: "card",
    branch: mockBranches[1],
    outlet: mockOutlets[2],
    customer: mockCustomers[1],
    user: {
      id: "USR002",
      name: "Jane Smith",
      email: "jane@example.com"
    }
  }
];

// Mock data for sales returns
const mockSalesReturns = [
  {
    id: "SR001",
    productName: "Premium Motor Spirit",
    quantity: 10,
    returnDate: "2024-03-16",
    reason: "Quality issues",
    refundAmount: 6170,
    status: "approved",
    branch: mockBranches[0],
    outlet: mockOutlets[0],
    customer: mockCustomers[0],
    user: {
      id: "USR001",
      name: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "SR002",
    productName: "Engine Oil",
    quantity: 2,
    returnDate: "2024-03-15",
    reason: "Wrong product",
    refundAmount: 10000,
    status: "pending",
    branch: mockBranches[1],
    outlet: mockOutlets[2],
    customer: mockCustomers[1],
    user: {
      id: "USR002",
      name: "Jane Smith",
      email: "jane@example.com"
    }
  }
];

const mockTanks = [
  {
    id: "TNK001",
    name: "Tank 01",
    product: "Premium Motor Spirit",
    capacity: 50000,
    currentLevel: 75,
    lastDelivery: "2024-03-15",
    status: "ACTIVE",
    branch: mockBranches[0],
    lastMaintenance: "2024-03-01",
    deliveryLogs: [
      {
        id: "DL001",
        date: "2024-03-15",
        quantity: 25000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED",
        cost: 15000000
      },
      {
        id: "DL002",
        date: "2024-03-10",
        quantity: 30000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED",
        cost: 18000000
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
    branch: mockBranches[1],
    lastMaintenance: "2024-03-05",
    deliveryLogs: [
      {
        id: "DL003",
        date: "2024-03-12",
        quantity: 20000,
        supplier: "FuelMasters Co",
        productType: "Automotive Gas Oil",
        status: "COMPLETED",
        cost: 19000000
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
    brand: "Shell",
    category: "Synthetic",
    lastRestocked: "2024-03-10",
    branch: mockBranches[0]
  },
  {
    id: "LUB002",
    name: "Brake Fluid",
    type: "Brake Oil",
    viscosity: "DOT 4",
    price: 2500,
    stock: 50,
    status: "Low Stock",
    brand: "Castrol",
    category: "Synthetic",
    lastRestocked: "2024-03-08",
    branch: mockBranches[1]
  },
  {
    id: "LUB003",
    name: "Transmission Fluid",
    type: "Transmission Oil",
    viscosity: "ATF",
    price: 3500,
    stock: 0,
    status: "Out of Stock",
    brand: "Mobil",
    category: "Synthetic",
    lastRestocked: "2024-03-05",
    branch: mockBranches[2]
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
    lastDelivery: "2024-03-15",
    supplier: "PetroSupply Ltd",
    branch: mockBranches[0]
  },
  {
    id: "FUEL002",
    name: "Automotive Gas Oil",
    type: "Diesel",
    price: 950,
    stock: 3000,
    status: "In Stock",
    tankId: "TNK002",
    lastDelivery: "2024-03-12",
    supplier: "FuelMasters Co",
    branch: mockBranches[1]
  },
  {
    id: "FUEL003",
    name: "Dual Purpose Kerosene",
    type: "DPK",
    price: 800,
    stock: 100,
    status: "Low Stock",
    tankId: "TNK003",
    lastDelivery: "2024-03-08",
    supplier: "PetroSupply Ltd",
    branch: mockBranches[2]
  }
];

// Mock data for staff
const mockStaff = [
  {
    id: "STF001",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "08099887766",
    role: "Cashier",
    branchId: "BR001",
    outletId: "OUT001",
    status: "active",
    createdAt: "2024-03-01",
    lastLogin: "2024-03-15",
    branch: mockBranches[0],
    outlet: mockOutlets[0]
  },
  {
    id: "STF002",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "08011223344",
    role: "Supervisor",
    branchId: "BR002",
    outletId: "OUT003",
    status: "active",
    createdAt: "2024-03-02",
    lastLogin: "2024-03-14",
    branch: mockBranches[1],
    outlet: mockOutlets[2]
  }
];

// Mock data for auth
const mockUsers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "admin@example.com",
    role: "ADMIN",
    priviledges: "*",
    lastLogin: "2024-03-15",
    createdAt: "2024-03-01",
    status: "active"
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "manager@example.com",
    role: "MANAGER",
    priviledges: ["VIEW_REPORTS", "MANAGE_INVENTORY"],
    lastLogin: "2024-03-14",
    createdAt: "2024-03-02",
    status: "active"
  }
];

// Mock data for product variations
const mockProductVariations = [
  {
    id: "VAR001",
    productId: "PRD001",
    type: "cooking_gas",
    name: "12.5kg Gas",
    allBranches: true,
    basePrice: 12500,
    branchPrices: [],
    status: "active",
    createdAt: "2024-03-15"
  },
  {
    id: "VAR002",
    productId: "PRD001",
    type: "cooking_gas",
    name: "6kg Gas",
    allBranches: true,
    basePrice: 7500,
    branchPrices: [],
    status: "active",
    createdAt: "2024-03-15"
  },
  {
    id: "VAR003",
    productId: "PRD002",
    type: "lubricant_oil",
    name: "SAE 40 Oil",
    allBranches: false,
    basePrice: null,
    branchPrices: [
      { branchId: "BR001", price: 5000 },
      { branchId: "BR002", price: 5200 }
    ],
    status: "active",
    createdAt: "2024-03-15"
  },
  {
    id: "VAR004",
    productId: "PRD002",
    type: "lubricant_oil",
    name: "SAE 50 Oil",
    allBranches: false,
    basePrice: null,
    branchPrices: [
      { branchId: "BR001", price: 5500 },
      { branchId: "BR002", price: 5700 }
    ],
    status: "active",
    createdAt: "2024-03-15"
  }
];

// Update products to include variations
const mockProductsWithVariations = [
  {
    id: "PRD001",
    name: "Premium Motor Spirit",
    categoryId: "CAT001",
    description: "High-quality fuel for vehicles",
    basePrice: 617,
    price: 617,
    allBranches: true,
    status: "In Stock",
    stock: 1000,
    category: mockProductCategories[0],
    branchPrices: [],
    totalSales: 50000,
    createdAt: "2024-03-01",
    branch: null,
    outlet: null,
    variations: mockProductVariations.filter(v => v.productId === "PRD001")
  },
  {
    id: "PRD002",
    name: "Engine Oil",
    categoryId: "CAT002",
    description: "Premium engine lubricant",
    basePrice: 5000,
    price: 5000,
    allBranches: false,
    branchPrices: [
      { branchId: "BR001", price: 5000 },
      { branchId: "BR002", price: 5200 }
    ],
    status: "In Stock",
    stock: 500,
    totalSales: 25000,
    createdAt: "2024-03-02",
    category: mockProductCategories[1],
    branch: mockBranches[0],
    outlet: mockOutlets[0],
    variations: mockProductVariations.filter(v => v.productId === "PRD002")
  }
];

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem(Token) ?? "";
    const refresh_token = localStorage.getItem(refreshToken) ?? "";
    config.headers.Authorization = `Bearer ${token} ${refresh_token}`;
    console.log("Making request to:", config.url);
    return config;
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  async (response: AxiosResponse<any, any>) => {
    const url = response.config.url;
    const method = response.config.method;
    let mockResponse = { ...response };

    // Handle product variations requests
    if (url?.startsWith("/products") && url.includes("/variations")) {
      console.log("Handling product variations request:", method, url);
      const productId = url.split("/")[2];
      
      if (method === "get") {
        mockResponse.data = mockProductVariations.filter(
          variation => variation.productId === productId
        );
      } else if (method === "post") {
        const newVariation = {
          id: `VAR${(mockProductVariations.length + 1).toString().padStart(3, '0')}`,
          productId,
          ...JSON.parse(response.config.data),
          status: "active",
          createdAt: new Date().toISOString().split("T")[0]
        };
        mockProductVariations.push(newVariation);
        
        // Update product's variations
        const product = mockProductsWithVariations.find(p => p.id === productId);
        if (product) {
          product.variations = mockProductVariations.filter(v => v.productId === productId);
        }
        
        mockResponse.data = newVariation;
      }
    }

    // Handle customers-related requests
    if (url?.startsWith("/customers")) {
      console.log("Handling customers request:", method, url);
      if (method === "get") {
        if (url === "/customers") {
          mockResponse.data = mockCustomers;
        } else {
          const customerId = url.split("/")[2];
          mockResponse.data = mockCustomers.find(
            customer => customer.id === customerId
          );
        }
      } else if (method === "post") {
        const newCustomer = {
          id: `CUS${(mockCustomers.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          status: "active",
          branch: mockBranches.find(
            branch => branch.id === JSON.parse(response.config.data).branchId
          ),
          outlet: mockOutlets.find(
            outlet => outlet.id === JSON.parse(response.config.data).outletId
          )
        };
        mockCustomers.push(newCustomer);
        mockResponse.data = newCustomer;
      } else if (method === "put") {
        const customerId = url.split("/")[2];
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockCustomers[customerIndex] = {
            ...mockCustomers[customerIndex],
            ...updatedData,
            branch: mockBranches.find(b => b.id === updatedData.branchId),
            outlet: mockOutlets.find(o => o.id === updatedData.outletId)
          };
          mockResponse.data = mockCustomers[customerIndex];
        }
      } else if (method === "delete") {
        const customerId = url.split("/")[2];
        const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          mockCustomers.splice(customerIndex, 1);
          mockResponse.data = { message: "Customer deleted successfully" };
        }
      }
    }

    // Handle branches-related requests
    if (url?.startsWith("/branches")) {
      console.log("Handling branches request:", method, url);
      if (method === "get") {
        const { hasManager } = response.config?.params || {};
        if (hasManager === false) {
          mockResponse.data = mockBranches.filter(
            branch => !mockManagers.some(
              manager => manager.managerType === "branch_manager" && 
                        manager.branchId === branch.id
            )
          );
        } else {
          mockResponse.data = url === "/branches"
            ? mockBranches
            : mockBranches.find(b => b.id === url.split("/")[2]);
        }
      } else if (method === "post") {
        const newBranch = {
          id: `BR${(mockBranches.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          status: "active"
        };
        mockBranches.push(newBranch);
        mockResponse.data = newBranch;
      } else if (method === "put") {
        const branchId = url.split("/")[2];
        const branchIndex = mockBranches.findIndex(b => b.id === branchId);
        if (branchIndex !== -1) {
          mockBranches[branchIndex] = {
            ...mockBranches[branchIndex],
            ...JSON.parse(response.config.data)
          };
          mockResponse.data = mockBranches[branchIndex];
        }
      } else if (method === "delete") {
        const branchId = url.split("/")[2];
        const branchIndex = mockBranches.findIndex(b => b.id === branchId);
        if (branchIndex !== -1) {
          mockBranches.splice(branchIndex, 1);
          mockResponse.data = { message: "Branch deleted successfully" };
        }
      }
    }

    // Handle outlets-related requests
    if (url?.startsWith("/outlets")) {
      console.log("Handling outlets request:", method, url);
      if (method === "get") {
        const { hasManager, branchId } = response.config?.params || {};
        let filteredOutlets = [...mockOutlets];
        
        if (hasManager === false) {
          filteredOutlets = filteredOutlets.filter(
            outlet => !mockManagers.some(
              manager => manager.managerType === "outlet_manager" && 
                        manager.outletId === outlet.id
            )
          );
        }
        
        if (branchId) {
          filteredOutlets = filteredOutlets.filter(
            outlet => outlet.branchId === branchId
          );
        }
        
        mockResponse.data = url === "/outlets"
          ? filteredOutlets
          : filteredOutlets.find(o => o.id === url.split("/")[2]);
      } else if (method === "post") {
        const newOutlet = {
          id: `OUT${(mockOutlets.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          status: "active",
          branch: mockBranches.find(
            branch => branch.id === JSON.parse(response.config.data).branchId
          )
        };
        mockOutlets.push(newOutlet);
        mockResponse.data = newOutlet;
      } else if (method === "put") {
        const outletId = url.split("/")[2];
        const outletIndex = mockOutlets.findIndex(o => o.id === outletId);
        if (outletIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockOutlets[outletIndex] = {
            ...mockOutlets[outletIndex],
            ...updatedData,
            branch: mockBranches.find(b => b.id === updatedData.branchId)
          };
          mockResponse.data = mockOutlets[outletIndex];
        }
      } else if (method === "delete") {
        const outletId = url.split("/")[2];
        const outletIndex = mockOutlets.findIndex(o => o.id === outletId);
        if (outletIndex !== -1) {
          mockOutlets.splice(outletIndex, 1);
          mockResponse.data = { message: "Outlet deleted successfully" };
        }
      }
    }

    // Handle products-related requests
    if (url?.startsWith("/products")) {
      console.log("Handling products request:", method, url);
      if (method === "get") {
        const { branch } = response.config?.params || {};
        let filteredProducts = [...mockProductsWithVariations];
        
        if (branch) {
          filteredProducts = filteredProducts.filter(product => 
            product.allBranches || product.branchPrices.some(bp => bp.branchId === branch)
          );
        }
        
        mockResponse.data = filteredProducts;
      } else if (method === "post") {
        const productData = JSON.parse(response.config.data);
        const newProduct = {
          id: `PRD${(mockProductsWithVariations.length + 1).toString().padStart(3, '0')}`,
          ...productData,
          status: "In Stock",
          stock: 0,
          category: mockProductCategories.find(cat => cat.id === productData.categoryId),
          branch: productData.branchId ? mockBranches.find(b => b.id === productData.branchId) : null,
          outlet: null,
          createdAt: new Date().toISOString().split("T")[0],
          variations: []
        };
        mockProductsWithVariations.push(newProduct);
        mockResponse.data = newProduct;
      } else if (method === "put") {
        const productId = url.split("/")[2];
        const productIndex = mockProductsWithVariations.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockProductsWithVariations[productIndex] = {
            ...mockProductsWithVariations[productIndex],
            ...updatedData,
            category: mockProductCategories.find(cat => cat.id === updatedData.categoryId),
            branch: updatedData.branchId ? mockBranches.find(b => b.id === updatedData.branchId) : null
          };
          mockResponse.data = mockProductsWithVariations[productIndex];
        }
      } else if (method === "delete") {
        const productId = url.split("/")[2];
        const productIndex = mockProductsWithVariations.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          mockProductsWithVariations.splice(productIndex, 1);
          mockResponse.data = { message: "Product deleted successfully" };
        }
      }
    }

    // Handle product categories requests
    if (url?.startsWith("/product-categories")) {
      console.log("Handling product categories request:", method, url);
      if (method === "get") {
        mockResponse.data = mockProductCategories;
      } else if (method === "post") {
        const newCategory = {
          id: `CAT${(mockProductCategories.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          status: "active",
          createdAt: new Date().toISOString().split("T")[0]
        };
        mockProductCategories.push(newCategory);
        mockResponse.data = newCategory;
      } else if (method === "put") {
        const categoryId = url.split("/")[2];
        const categoryIndex = mockProductCategories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
          mockProductCategories[categoryIndex] = {
            ...mockProductCategories[categoryIndex],
            ...JSON.parse(response.config.data)
          };
          mockResponse.data = mockProductCategories[categoryIndex];
        }
      } else if (method === "delete") {
        const categoryId = url.split("/")[2];
        const categoryIndex = mockProductCategories.findIndex(c => c.id === categoryId);
        if (categoryIndex !== -1) {
          mockProductCategories.splice(categoryIndex, 1);
          mockResponse.data = { message: "Category deleted successfully" };
        }
      }
    }

    // Handle sales-related requests
    if (url?.startsWith("/sales")) {
      console.log("Handling sales request:", method, url);
      if (method === "get") {
        mockResponse.data = mockSales;
      } else if (method === "post") {
        const newSale = {
          id: `SL${(mockSales.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          date: new Date().toISOString().split("T")[0],
          status: "completed"
        };
        mockSales.push(newSale);
        mockResponse.data = newSale;
      }
    }

    if (url?.startsWith("/sales-returns")) {
      console.log("Handling sales returns request:", method, url);
      if (method === "get") {
        mockResponse.data = mockSalesReturns;
      } else if (method === "post") {
        const newReturn = {
          id: `SR${(mockSalesReturns.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          returnDate: new Date().toISOString().split("T")[0],
          status: "pending"
        };
        mockSalesReturns.push(newReturn);
        mockResponse.data = newReturn;
      } else if (method === "put") {
        const returnId = url.split("/")[2];
        const returnIndex = mockSalesReturns.findIndex(r => r.id === returnId);
        if (returnIndex !== -1) {
          mockSalesReturns[returnIndex] = {
            ...mockSalesReturns[returnIndex],
            ...JSON.parse(response.config.data)
          };
          mockResponse.data = mockSalesReturns[returnIndex];
        }
      }
    }

    // Handle tanks-related requests
    if (url?.startsWith("/tanks")) {
      console.log("Handling tanks request:", method, url);
      if (method === "get") {
        mockResponse.data = mockTanks;
      } else if (method === "post") {
        const newTank = {
          id: `TNK${(mockTanks.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          status: "ACTIVE",
          deliveryLogs: []
        };
        mockTanks.push(newTank);
        mockResponse.data = newTank;
      } else if (method === "put") {
        const tankId = url.split("/")[2];
        const tankIndex = mockTanks.findIndex(t => t.id === tankId);
        if (tankIndex !== -1) {
          mockTanks[tankIndex] = {
            ...mockTanks[tankIndex],
            ...JSON.parse(response.config.data)
          };
          mockResponse.data = mockTanks[tankIndex];
        }
      }
    }

    // Handle staff-related requests
    if (url?.startsWith("/staff")) {
      console.log("Handling staff request:", method, url);
      if (method === "get") {
        mockResponse.data = mockStaff;
      } else if (method === "post") {
        const newStaff = {
          id: `STF${(mockStaff.length + 1).toString().padStart(3, '0')}`,
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          status: "active"
        };
        mockStaff.push(newStaff);
        mockResponse.data = newStaff;
      } else if (method === "put") {
        const staffId = url.split("/")[2];
        const staffIndex = mockStaff.findIndex(s => s.id === staffId);
        if (staffIndex !== -1) {
          mockStaff[staffIndex] = {
            ...mockStaff[staffIndex],
            ...JSON.parse(response.config.data)
          };
          mockResponse.data = mockStaff[staffIndex];
        }
      } else if (method === "delete") {
        const staffId = url.split("/")[2];
        const staffIndex = mockStaff.findIndex(s => s.id === staffId);
        if (staffIndex !== -1) {
          mockStaff.splice(staffIndex, 1);
          mockResponse.data = { message: "Staff deleted successfully" };
        }
      }
    }

    // Handle auth-related requests
    if (url?.startsWith("/auth")) {
      console.log("Handling auth request:", method, url);
      if (url === "/auth/logged-in") {
        const token = localStorage.getItem(Token);
        if (token) {
          mockResponse.data = {
            user: mockUsers[0]
          };
        } else {
          mockResponse.status = 401;
          throw new Error("Unauthorized");
        }
      } else if (url === "/auth/login") {
        mockResponse.data = {
          token: "mock-token-12345",
          refresh_token: "mock-refresh-token-12345",
          user: mockUsers[0]
        };
      }
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

export { axiosClient };
