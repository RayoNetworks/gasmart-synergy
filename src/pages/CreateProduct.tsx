import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface BranchPrice {
  branchId: string;
  price: string;
  categoryId?: string;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchPrices, setBranchPrices] = useState<BranchPrice[]>([]);
  const [allBranches, setAllBranches] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [applyCategoriesToAll, setApplyCategoriesToAll] = useState(true);

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosClient.get("/branches");
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await axiosClient.get("/product-categories");
      return response.data;
    },
  });

  const handleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
      setBranchPrices(branchPrices.filter((bp) => bp.branchId !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
      setBranchPrices([
        ...branchPrices,
        { branchId, price: basePrice, categoryId: applyCategoriesToAll ? selectedCategory : undefined },
      ]);
    }
  };

  const handlePriceChange = (branchId: string, price: string) => {
    setBranchPrices(
      branchPrices.map((bp) =>
        bp.branchId === branchId ? { ...bp, price } : bp
      )
    );
  };

  const handleBranchCategoryChange = (branchId: string, categoryId: string) => {
    setBranchPrices(
      branchPrices.map((bp) =>
        bp.branchId === branchId ? { ...bp, categoryId } : bp
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName) {
      toast.error("Please enter a product name");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!allBranches && selectedBranches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    if (allBranches && !basePrice) {
      toast.error("Please enter a base price");
      return;
    }

    const productData = {
      name: productName,
      categoryId: selectedCategory,
      allBranches,
      basePrice: allBranches ? basePrice : null,
      branchPrices: allBranches ? [] : branchPrices,
      applyCategoriesToAll,
    };

    try {
      await axiosClient.post("/products", productData);
      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to create product");
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., Premium Motor Spirit (PMS), Lubricant Oil, LPG Gas"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Product Category</Label>
            <Select 
              value={selectedCategory || "select-category"} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-category" disabled>Select a category</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="block mb-4">Branch Availability</Label>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="allBranches"
                checked={allBranches}
                onCheckedChange={(checked) => {
                  setAllBranches(checked as boolean);
                  if (checked) {
                    setSelectedBranches([]);
                    setBranchPrices([]);
                  }
                }}
              />
              <label
                htmlFor="allBranches"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Available in all branches
              </label>
            </div>

            {allBranches ? (
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (₦)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="Enter base price"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="applyCategoriesToAll"
                    checked={applyCategoriesToAll}
                    onCheckedChange={(checked) => setApplyCategoriesToAll(checked as boolean)}
                  />
                  <label
                    htmlFor="applyCategoriesToAll"
                    className="text-sm font-medium leading-none"
                  >
                    Apply selected category to all branches
                  </label>
                </div>

                <Label>Select Branches and Set Prices</Label>
                <div className="space-y-4">
                  {branches?.map((branch: any) => (
                    <div key={branch.id} className="flex items-center space-x-4">
                      <Checkbox
                        id={`branch-${branch.id}`}
                        checked={selectedBranches.includes(branch.id)}
                        onCheckedChange={() => handleBranchSelection(branch.id)}
                      />
                      <label
                        htmlFor={`branch-${branch.id}`}
                        className="flex-1 text-sm font-medium"
                      >
                        {branch.name}
                      </label>
                      {selectedBranches.includes(branch.id) && (
                        <>
                          <Input
                            type="number"
                            placeholder="Price (₦)"
                            className="w-32"
                            value={
                              branchPrices.find((bp) => bp.branchId === branch.id)
                                ?.price || ""
                            }
                            onChange={(e) =>
                              handlePriceChange(branch.id, e.target.value)
                            }
                          />
                          {!applyCategoriesToAll && (
                            <Select
                              value={
                                branchPrices.find((bp) => bp.branchId === branch.id)
                                  ?.categoryId || "select-category"
                              }
                              onValueChange={(value) =>
                                handleBranchCategoryChange(branch.id, value)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="select-category" disabled>Select category</SelectItem>
                                {categories?.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit">Create Product</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;