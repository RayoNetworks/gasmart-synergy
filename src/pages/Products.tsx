import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch branches
  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  // Fetch outlets based on selected branch
  const { data: outlets, isLoading: isLoadingOutlets } = useQuery({
    queryKey: ["outlets", selectedBranch],
    queryFn: async () => {
      if (!selectedBranch) return [];
      const response = await axiosClient.get("/outlets", {
        params: { branchId: selectedBranch }
      });
      return response.data;
    },
    enabled: !!selectedBranch, // Only fetch when a branch is selected
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await axiosClient.get("/product-categories");
      return response.data;
    },
  });

  const {
    data: products,
    refetch,
    isLoading: isLoadingProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosClient.get("/products", {
        params: {
          // this w
          branch: selectedBranch,
          // outlet: selectedOutlet,
        },
      });
      return response.data;
    },
  });

  const getBranchPrice = (product: any, branchId: string) => {
    if (product.allBranches) {
      return parseFloat(product.basePrice);
    }
    const branchPrice = product.branchPrices.find(
      (bp: any) => bp.branchId === branchId
    );
    return branchPrice ? parseFloat(branchPrice.price) : product.price;
  };

  const handleDelete = async () => {
    if (selectedProductId) {
      try {
        await axiosClient.delete(`/products/${selectedProductId}`);
        toast.success("Product deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete product");
      }
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBranch("all");
    setSelectedOutlet("all");
    setSelectedCategory("all");
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    // this reset to all
    setSelectedOutlet("all"); // Reset outlet when branch changes
    // this is to call the fetching of products but this time, we are passing in the selected branch.
    refetch();
  };

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBranch =
      !selectedBranch ||
      product.allBranches ||
      product.branchPrices.some((bp: any) => bp.branchId === selectedBranch);
    const matchesOutlet =
      !selectedOutlet || product.outletId === selectedOutlet;
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;

    return matchesSearch && matchesBranch && matchesOutlet && matchesCategory;
  });

  if (isLoadingBranches || isLoadingCategories || isLoadingProducts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => navigate("/admin/products/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/4"
        />

        <Select value={selectedBranch} onValueChange={handleBranchChange}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches?.map((branch: any) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedBranch && (
          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outlets?.map((outlet: any) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product?.category?.name}</TableCell>
                <TableCell>
                  ₦
                  {selectedBranch && selectedBranch !== "all"
                    ? getBranchPrice(product, selectedBranch).toFixed(2)
                    : product.price.toFixed(2)}
                </TableCell>

                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "Low Stock" ? "destructive" : "default"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product);
                          setViewDialogOpen(true);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.id}`)
                        }
                      >
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/admin/products/variation/${product.id}/create`
                          )
                        }
                      >
                        Create Variation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/products/stock/${product.id}`)
                        }
                      >
                        Check Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Name</h4>
                <p>{selectedProduct.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{selectedProduct.category?.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Pricing</h4>
                {selectedProduct.allBranches ? (
                  <p>Base Price: ₦{selectedProduct.basePrice}</p>
                ) : (
                  <div className="space-y-2">
                    {selectedProduct.branchPrices.map((bp: any) => (
                      <p key={bp.branchId}>
                        {branches?.find((b) => b.id === bp.branchId)?.name}: ₦
                        {bp.price}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold">Stock</h4>
                <p>{selectedProduct.stock}</p>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <Badge
                  variant={
                    selectedProduct.status === "Low Stock"
                      ? "destructive"
                      : "default"
                  }
                >
                  {selectedProduct.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;