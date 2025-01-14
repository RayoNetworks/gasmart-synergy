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
import { set } from "date-fns";

interface BranchPrice {
  branchId: string;
  price: string;
}

interface OutletPrice {
  outletId: string;
  price: string;
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
      categoryId: selectedCategory,
      allBranches,
      basePrice: allBranches ? basePrice : null,
      branchPrices: priceType === "branch" ? branchPrices : [],
      outletPrices: priceType === "outlet" ? outletPrices : [],
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
          <div className="space-y-2">
            <Label>Product Name</Label>
            <p className="text-lg font-medium">{product?.name}</p>
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
                <Label>Select Branches and Set Prices</Label>
                <div className="space-y-4">
                  {branches?.map((branch: any) => (
                    <div key={branch.id} className="space-y-4">
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
                              <RadioGroupItem value="branch" id="branch" />
                              <Label htmlFor="branch">Set price for entire branch</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="outlet" id="outlet" />
                              <Label htmlFor="outlet">Set price per outlet</Label>
                            </div>
                          </RadioGroup>

                          {priceType === "branch" ? (
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
                          ) : (
                            <div className="space-y-2">
                              {outlets?.map((outlet: any) => (
                                <div key={outlet.id} className="flex items-center space-x-4">
                                  <span className="text-sm">{outlet.name}</span>
                                  <Input
                                    type="number"
                                    placeholder="Price (₦)"
                                    className="w-32"
                                    value={
                                      outletPrices.find((op) => op.outletId === outlet.id)
                                        ?.price || ""
                                    }
                                    onChange={(e) =>
                                      handleOutletPriceChange(outlet.id, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit">Edit Product</Button>
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

export default EditProduct;