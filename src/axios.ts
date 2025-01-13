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
    // this is for the manager related route request
    if (url?.startsWith("/managers")) {
      if (method == "get") {
        const { managerType } = response.config?.params;
        // this is if the params are added, then filter the manager by the managerType
        if (managerType) {
          const mockManagersArr = [...mockManagers].filter((manager) =>
            managerType == "all" ? manager : manager?.managerType == managerType
          );
          console.log(mockManagersArr);
          mockResponse.data = mockManagersArr;
        }
      }
    }
    // Handle customers-related requests
    if (url?.startsWith("/customers")) {
      if (method === "get") {
        if (url === "/customers") {
          console.log("Fetching all customers");
          mockResponse.data = mockCustomers;
        } else {
          const customerId = url.split("/")[2];
          console.log("Fetching customer with ID:", customerId);
          mockResponse.data = mockCustomers.find(
            (customer) => customer.id === customerId
          );
        }
      } else if (method === "post") {
        console.log("Creating new customer:", response.config.data);
        const newCustomer = {
          id: (mockCustomers.length + 1).toString(),
          ...JSON.parse(response.config.data),
          createdAt: new Date().toISOString().split("T")[0],
          status: "active",
          branch: mockBranches.find(
            (branch) => branch.id === JSON.parse(response.config.data).branchId
          ),
          outlet: mockOutlets.find(
            (outlet) => outlet.id === JSON.parse(response.config.data).outletId
          ),
        };
        mockCustomers.push(newCustomer);
        mockResponse.data = newCustomer;
      } else if (method === "put") {
        const customerId = url.split("/")[2];
        console.log("Updating customer with ID:", customerId);
        const customerIndex = mockCustomers.findIndex(
          (c) => c.id === customerId
        );
        if (customerIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockCustomers[customerIndex] = {
            ...mockCustomers[customerIndex],
            ...updatedData,
            branch: mockBranches.find((b) => b.id === updatedData.branchId),
            outlet: mockOutlets.find((o) => o.id === updatedData.outletId),
          };
          mockResponse.data = mockCustomers[customerIndex];
        }
      } else if (method === "delete") {
        const customerId = url.split("/")[2];
        console.log("Deleting customer with ID:", customerId);
        const customerIndex = mockCustomers.findIndex(
          (c) => c.id === customerId
        );
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
          (branch) =>
            !mockManagers.some(
              (manager) =>
                manager.managerType === "branch_manager" &&
                manager.branchId === branch.id
            )
        );
      }
    }

    // Handle unassigned outlets request
    if (url === "/outlets" && method === "get") {
      const { hasManager } = response.config.params || {};
      if (hasManager === false) {
        mockResponse.data = mockOutlets.filter(
          (outlet) =>
            !mockManagers.some(
              (manager) =>
                manager.managerType === "outlet_manager" &&
                manager.outletId === outlet.id
            )
        );
      }
    }

    // Handle outlets requests with filtering
    if (url?.startsWith("/outlets")) {
      if (method === "get") {
        let filteredOutlets = [...mockOutlets];
        const { branchId, outletName } = response.config.params || {};

        if (branchId) {
          filteredOutlets = filteredOutlets.filter(
            (outlet) => outlet.branchId === branchId
          );
        }

        if (outletName) {
          filteredOutlets = filteredOutlets.filter((outlet) =>
            outlet.name.toLowerCase().includes(outletName.toLowerCase())
          );
        }

        mockResponse.data = filteredOutlets;
      }
    }

    // Handle outlets requests
    if (url?.startsWith("/outlets")) {
      if (method === "get") {
        if (url === "/outlets") {
          mockResponse.data = mockOutlets;
        } else {
          // Get single outlet
          const outletId = url.split("/")[2];
          mockResponse.data = mockOutlets.find(
            (outlet) => outlet.id === outletId
          );
        }
      } else if (method === "post") {
        const newOutlet = {
          id: (mockOutlets.length + 1).toString(),
          ...JSON.parse(response.config.data),
          status: "active",
          branch: mockBranches.find(
            (branch) => branch.id === JSON.parse(response.config.data).branchId
          ),
        };
        mockOutlets.push(newOutlet);
        mockResponse.data = newOutlet;
      } else if (method === "put") {
        const outletId = url.split("/")[2];
        const outletIndex = mockOutlets.findIndex(
          (outlet) => outlet.id === outletId
        );

        if (outletIndex !== -1) {
          const updatedData = JSON.parse(response.config.data);
          mockOutlets[outletIndex] = {
            ...mockOutlets[outletIndex],
            ...updatedData,
            branch: mockBranches.find(
              (branch) => branch.id === updatedData.branchId
            ),
          };
          mockResponse.data = mockOutlets[outletIndex];
          console.log("Updated outlet:", mockOutlets[outletIndex]);
        }
      }
    }

    // Handle products requests
    if (url?.startsWith("/products")) {
      if (method === "get") {
        const {branch, } = response.config.params

        // if(branch){
        //   // then filter the products based on the selected branch.
        //   const mockProductArr = [...mockProducts]
        //   mockResponse.data = mockProductArr.filter((product) => branch == 'all'? product: product.allBranches.includes(branch)? product:  )

        // }
        mockResponse.data = mockProducts;

      } else if (method === "post") {
        const productData = JSON.parse(response.config.data);
        const newProduct = {
          id: (mockProducts.length + 1).toString(),
          ...productData,
          availableBranches: productData.allBranches 
            ? ["*"] 
            : productData.branchPrices.map((bp: any) => ({
                id: bp.branchId,
                name: mockBranches.find((b: any) => b.id === bp.branchId)?.name || ''
              })),
          status: "In Stock",
          stock: 0,
          price: parseFloat(
            productData.allBranches
              ? productData.basePrice
              : productData.branchPrices[0]?.price || "0"
          ),
          category: mockProductCategories.find(
            (cat) => cat.id === productData.categoryId
          ),
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
      if (method == "get") {
        console.log("products");
        mockResponse.data = mockProducts;
      }
      if (method == "post") {
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