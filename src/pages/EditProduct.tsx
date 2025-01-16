import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { DatePicker } from "@/components/ui/data-picker" // Ensure this is a valid import for your DatePicker component
import exp from "constants";

interface BranchPrice {
  branchId: string;
  price: string;
  effectiveDate?: string;
  duration?: string;
}

interface OutletPrice {
  outletId: string;
  price: string;
  effectiveDate?: string;
  duration?: string;
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchPrices, setBranchPrices] = useState<BranchPrice[]>([]);
  const [outletPrices, setOutletPrices] = useState<OutletPrice[]>([]);
  const [allBranches, setAllBranches] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceType, setPriceType] = useState<"branch" | "outlet">("branch");

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);

      setSelectedCategory(response.data.categoryId);
      setAllBranches(response.data.allBranches);
      setBasePrice(response.data.basePrice);
      setBranchPrices(response.data.branchPrices);
      return response.data;
    },
  });

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
        params: { branchId: selectedBranches[0] },
      });
      return response.data;
    },
    enabled: selectedBranches.length > 0 && priceType === "outlet",
  });

  const handleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
      setBranchPrices(branchPrices.filter((bp) => bp.branchId !== branchId));
      setOutletPrices(
        outletPrices.filter(
          (op) =>
            !outlets?.find((o: any) => o.branchId === branchId && o.id === op.outletId)
        )
      );
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
    const existingPrice = outletPrices.find((op) => op.outletId === outletId);
    if (existingPrice) {
      setOutletPrices(
        outletPrices.map((op) =>
          op.outletId === outletId ? { ...op, price } : op
        )
      );
    } else {
      setOutletPrices([...outletPrices, { outletId, price }]);
    }
  };

  const handleEffectiveDateChange = (id: string, effectiveDate: string) => {
    setBranchPrices(
      branchPrices.map((bp) =>
        bp.branchId === id ? { ...bp, effectiveDate } : bp
      )
    );
    setOutletPrices(
      outletPrices.map((op) =>
        op.outletId === id ? { ...op, effectiveDate } : op
      )
    );
  };

  const handleDurationChange = (id: string, duration: string) => {
    setBranchPrices(
      branchPrices.map((bp) =>
        bp.branchId === id ? { ...bp, duration } : bp
      )
    );
    setOutletPrices(
      outletPrices.map((op) =>
        op.outletId === id ? { ...op, duration } : op
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      id,
      categoryId: selectedCategory,
      allBranches,
      basePrice: allBranches ? basePrice : null,
      branchPrices: priceType === "branch" ? branchPrices : [],
      outletPrices: priceType === "outlet" ? outletPrices : [],
      name: "LPG Gas Cylinder 12.5kg",
      description: "Standard cooking gas cylinder",
      price: allBranches ? Number(basePrice) : 8500,
      status: "In Stock",
      category: { id: "1", name: "Gas Cylinders" },
      variations: [
        {
          id: "1-1",
          type: "Accessory",
          name: "With Hose",
          allBranches: true,
          basePrice: 9000,
          branchPrices: [],
        },
        {
          id: "1-2",
          type: "Accessory",
          name: "Without Hose",
          allBranches: true,
          basePrice: 8500,
          branchPrices: [],
        },
      ],
    };

    try {
      console.log("editing product with data:", productData);
      await axiosClient.put(`/products/${id}`, productData);
      toast.success("Product edited successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to edit product");
      console.error("Error editing product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <p className="text-lg font-medium">{product?.name || "Loading..."}</p>
          </div>

          {/* Product Category */}
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
                <SelectItem value="select-category" disabled>
                  Select a category
                </SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Availability */}
          <div className="space-y-2">
            <Label className="block mb-4">
              Branch Availability <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Choose whether this product is available in all branches or specific
              ones.
            </p>
            <Checkbox
              id="allBranches"
              checked={allBranches}
              onCheckedChange={(checked) => setAllBranches(!!checked)}
            />
            <Label htmlFor="allBranches" className="ml-2">
              Available in all branches
            </Label>
            {!allBranches && (
              <div className="mt-4 space-y-2">
                {branches?.map((branch: any) => (
                  <div key={branch.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      checked={selectedBranches.includes(branch.id)}
                      onCheckedChange={() => handleBranchSelection(branch.id)}
                    />
                    <Label htmlFor={`branch-${branch.id}`}>{branch.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <Label htmlFor="basePrice">
              Base Price <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              Specify the default price of this product for all branches or
              selected branches.
            </p>
            <Input
              id="basePrice"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Enter base price"
            />
          </div>

          {/* Branch-Specific Prices */}
          {!allBranches && (
            <div className="space-y-4">
              <Label className="block">Branch-Specific Prices</Label>
              <p className="text-sm text-gray-500">
                Set custom prices, effective dates, and durations for each branch.
              </p>
              {branchPrices.map((branchPrice) => (
                <div
                  key={branchPrice.branchId}
                  className="p-4 border border-gray-300 rounded-md space-y-2"
                >
                  <p className="text-sm font-medium">
                    Branch:{" "}
                    {branches?.find((b) => b.id === branchPrice.branchId)?.name || "Unknown"}
                  </p>

                  {/* Price Input */}
                  <div>
                    <Label htmlFor={`price-${branchPrice.branchId}`}>
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`price-${branchPrice.branchId}`}
                      type="number"
                      value={branchPrice.price}
                      onChange={(e) =>
                        handlePriceChange(branchPrice.branchId, e.target.value)
                      }
                      placeholder="Enter price for this branch"
                    />
                  </div>

                  {/* Effective Date */}
                  <div>
                    <Label htmlFor={`effectiveDate-${branchPrice.branchId}`}>
                      Effective Date <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-gray-500">
                      Select the date when this price should start.
                    </p>
                    <DatePicker
                      // id={`effectiveDate-${branchPrice.branchId}`}
                      value={
                        branchPrice.effectiveDate
                          ? new Date(branchPrice.effectiveDate)
                          : null
                      }
                      onChange={(date) =>
                        handleEffectiveDateChange(
                          branchPrice.branchId,
                          date?.toISOString() || ""
                        )
                      }
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor={`duration-${branchPrice.branchId}`}>
                      Duration (Optional)
                    </Label>
                    <p className="text-sm text-gray-500">
                      Select how long this price will remain active.
                    </p>
                    <Select
                      value={branchPrice.duration || "select-duration"}
                      onValueChange={(value) =>
                        handleDurationChange(branchPrice.branchId, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 Week</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );


}

export default EditProduct;