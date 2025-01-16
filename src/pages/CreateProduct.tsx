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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BranchPrice {
  branchId: string;
  price: string;
}

interface OutletPrice {
  outletId: string;
  price: string;
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchPrices, setBranchPrices] = useState<BranchPrice[]>([]);
  const [outletPrices, setOutletPrices] = useState<OutletPrice[]>([]);
  const [allBranches, setAllBranches] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceType, setPriceType] = useState<"branch" | "outlet">("branch");
  const [discount, setDiscount] = useState(0); // New state for discount percentage
  const [quantity, setQuantity] = useState(1); // New state for product quantity

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

  const { data: outlets, refetch: refetchOutlets } = useQuery({
    queryKey: ["outlets", selectedBranches],
    queryFn: async () => {
      if (selectedBranches.length === 0) return [];
      const response = await axiosClient.get("/outlets", {
        params: { branchId: selectedBranches[0] }
      });
      return response.data;
    },
    enabled: selectedBranches.length > 0 && priceType === "outlet",
  });

  const handleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
      setBranchPrices(branchPrices.filter((bp) => bp.branchId !== branchId));
      setOutletPrices(outletPrices.filter((op) => 
        !outlets?.find((o: any) => o.branchId === branchId && o.id === op.outletId)
      ));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
      setBranchPrices([...branchPrices, { branchId, price: basePrice }]);
    }
  };

  const handlePriceChange = (branchId: string, price: string) => {
    setBranchPrices(
      branchPrices.map((bp) =>
        bp.branchId === branchId ? { ...bp, price } : bp
      )
    );
  };

  const handleOutletPriceChange = (outletId: string, price: string) => {
    const existingPrice = outletPrices.find(op => op.outletId === outletId);
    if (existingPrice) {
      setOutletPrices(outletPrices.map(op => 
        op.outletId === outletId ? { ...op, price } : op
      ));
    } else {
      setOutletPrices([...outletPrices, { outletId, price }]);
    }
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

    // Apply discount to the total price based on quantity
    const priceAfterDiscount = (parseFloat(basePrice) * (1 - discount / 100)) * quantity;

    const productData = {
      name: productName,
      categoryId: selectedCategory,
      allBranches,
      basePrice: allBranches ? basePrice : null,
      branchPrices: priceType === "branch" ? branchPrices : [],
      outletPrices: priceType === "outlet" ? outletPrices : [],
      discount, // Added discount
      quantity, // Added quantity
      priceAfterDiscount, // Added discounted price calculation
    };

    try {
      console.log("Creating product with data:", productData);
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
            <Label htmlFor="productName">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Enter a descriptive name for your product.
            </p>
            <Input
              id="productName"
              placeholder="e.g., Premium Motor Spirit (PMS), Lubricant Oil, LPG Gas"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Product Category <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Select the category that best describes this product.
            </p>
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
            <Label className="block mb-4">
              Branch Availability <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Choose whether this product is available in all branches or specific ones.
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="allBranches"
                checked={allBranches}
                onCheckedChange={(checked) => {
                  setAllBranches(checked as boolean);
                  if (checked) {
                    setSelectedBranches([]);
                    setBranchPrices([]);
                    setOutletPrices([]);
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
                <Label htmlFor="basePrice">
                  Base Price (₦) <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500">
                  Set the default price for this product across all branches.
                </p>
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
                <Label>Select Branches and Set Prices</Label>
                <div className="space-y-4">
                  {branches?.map((branch: any) => (
                    <div key={branch.id} className="p-4 border border-gray-300 rounded-md space-y-4">
                      <div className="flex items-center space-x-4">
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
                      </div>

                      {selectedBranches.includes(branch.id) && (
                        <div className="ml-6 space-y-4">
                          <RadioGroup 
                            value={priceType} 
                            onValueChange={(value: "branch" | "outlet") => setPriceType(value)}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="branch" id="branch-radio" />
                              <Label htmlFor="branch-radio">Branch</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="outlet" id="outlet-radio" />
                              <Label htmlFor="outlet-radio">Outlet</Label>
                            </div>
                          </RadioGroup>
                          <div>
                            <Label htmlFor={`price-${branch.id}`}>
                              Price <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`price-${branch.id}`}
                              value={branchPrices.find(bp => bp.branchId === branch.id)?.price || ""}
                              onChange={(e) => handlePriceChange(branch.id, e.target.value)}
                              placeholder="Set price for this branch"
                              type="number"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <p className="text-sm text-gray-500">
              Set an optional discount percentage for this product.
            </p>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Enter discount percentage"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Specify the initial stock quantity for this product.
            </p>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              placeholder="Enter product quantity"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">Create Product</Button>
      </form>
    </div>
  );
};

export default CreateProduct;