
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../utils/api';
import { useToast } from '@/components/ui/use-toast';

// Generic hook for API interactions
export const useApiClient = <T>(
  entityType: string,
  apiModule: typeof api.productsAPI | typeof api.salesAPI | typeof api.customersAPI | any
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query hook for getting all entities
  const useGetAll = (options = {}) => {
    return useQuery({
      queryKey: [entityType],
      queryFn: apiModule.getAll,
      ...options,
    });
  };
  
  // Query hook for getting a single entity by ID
  const useGetById = (id: string, options = {}) => {
    return useQuery({
      queryKey: [entityType, id],
      queryFn: () => apiModule.getById(id),
      enabled: !!id,
      ...options,
    });
  };
  
  // Mutation hook for creating an entity
  const useCreate = (options = {}) => {
    return useMutation({
      mutationFn: apiModule.create,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [entityType] });
        toast({
          title: "Success",
          description: `${entityType} created successfully`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to create ${entityType}: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  // Mutation hook for updating an entity
  const useUpdate = (options = {}) => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: T }) => apiModule.update(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: [entityType] });
        queryClient.invalidateQueries({ queryKey: [entityType, variables.id] });
        toast({
          title: "Success",
          description: `${entityType} updated successfully`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to update ${entityType}: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  // Mutation hook for deleting an entity
  const useDelete = (options = {}) => {
    return useMutation({
      mutationFn: apiModule.delete,
      onSuccess: (data, id) => {
        queryClient.invalidateQueries({ queryKey: [entityType] });
        queryClient.removeQueries({ queryKey: [entityType, id] });
        toast({
          title: "Success",
          description: `${entityType} deleted successfully`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to delete ${entityType}: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
};

// Specific hooks for different entity types
export const useProductsApi = () => useApiClient('product', api.productsAPI);
export const useSalesApi = () => useApiClient('sale', api.salesAPI);
export const useCustomersApi = () => useApiClient('customer', api.customersAPI);
export const useProductCategoriesApi = () => useApiClient('productCategory', api.productCategoriesAPI);
export const useBranchesApi = () => useApiClient('branch', api.branchesAPI);
export const useOutletsApi = () => useApiClient('outlet', api.outletsAPI);
export const useTanksApi = () => useApiClient('tank', api.tanksAPI);

// Specialized hooks for other API endpoints
export const useDiscountApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const useGetProductDiscounts = (options = {}) => {
    return useQuery({
      queryKey: ['productDiscounts'],
      queryFn: api.discountAPI.getProductDiscounts,
      ...options,
    });
  };
  
  const useApplyDiscount = (options = {}) => {
    return useMutation({
      mutationFn: ({ productId, data }: { productId: string; data: any }) => 
        api.discountAPI.applyDiscount(productId, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['productDiscounts'] });
        queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
        toast({
          title: "Success",
          description: "Discount applied successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to apply discount: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  const useRemoveDiscount = (options = {}) => {
    return useMutation({
      mutationFn: api.discountAPI.removeDiscount,
      onSuccess: (data, productId) => {
        queryClient.invalidateQueries({ queryKey: ['productDiscounts'] });
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        toast({
          title: "Success",
          description: "Discount removed successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to remove discount: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  return {
    useGetProductDiscounts,
    useApplyDiscount,
    useRemoveDiscount,
  };
};

export const useConversionApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const useGetConversionRatio = (options = {}) => {
    return useQuery({
      queryKey: ['conversionRatio'],
      queryFn: api.conversionAPI.getConversionRatio,
      ...options,
    });
  };
  
  const useSetConversionRatio = (options = {}) => {
    return useMutation({
      mutationFn: api.conversionAPI.setConversionRatio,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversionRatio'] });
        toast({
          title: "Success",
          description: "Conversion ratio updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to update conversion ratio: ${error.message}`,
          variant: "destructive",
        });
      },
      ...options,
    });
  };
  
  return {
    useGetConversionRatio,
    useSetConversionRatio,
  };
};

export const useAnalyticsApi = () => {
  const useGetSalesSummary = (options = {}) => {
    return useQuery({
      queryKey: ['analytics', 'salesSummary'],
      queryFn: api.analyticsAPI.getSalesSummary,
      ...options,
    });
  };
  
  const useGetRevenueByProduct = (options = {}) => {
    return useQuery({
      queryKey: ['analytics', 'revenueByProduct'],
      queryFn: api.analyticsAPI.getRevenueByProduct,
      ...options,
    });
  };
  
  const useGetRevenueByBranch = (options = {}) => {
    return useQuery({
      queryKey: ['analytics', 'revenueByBranch'],
      queryFn: api.analyticsAPI.getRevenueByBranch,
      ...options,
    });
  };
  
  return {
    useGetSalesSummary,
    useGetRevenueByProduct,
    useGetRevenueByBranch,
  };
};

export const useReportsApi = () => {
  const useGetSalesReport = (params: any, options = {}) => {
    return useQuery({
      queryKey: ['reports', 'sales', params],
      queryFn: () => api.reportsAPI.getSalesReport(params),
      ...options,
    });
  };
  
  const useGetInventoryReport = (params: any, options = {}) => {
    return useQuery({
      queryKey: ['reports', 'inventory', params],
      queryFn: () => api.reportsAPI.getInventoryReport(params),
      ...options,
    });
  };
  
  const useGetCustomerReport = (params: any, options = {}) => {
    return useQuery({
      queryKey: ['reports', 'customers', params],
      queryFn: () => api.reportsAPI.getCustomerReport(params),
      ...options,
    });
  };
  
  return {
    useGetSalesReport,
    useGetInventoryReport,
    useGetCustomerReport,
  };
};
