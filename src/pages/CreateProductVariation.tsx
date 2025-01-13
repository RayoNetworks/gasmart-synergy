import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface VariationPrice {
  branchId: string;
  price: string;
}

const CreateProductVariation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [variationType, setVariationType] = useState("");
  const [variationName, setVariationName] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchPrices, setBranchPrices] = useState<VariationPrice[]>([]);
  const [allBranches, setAllBranches] = useState(false);
  const [basePrice, setBasePrice] = useState("");

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
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

  const handleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
      setBranchPrices(branchPrices.filter((bp) => bp.branchId !== branchId));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variationType) {
      toast.error("Please select a variation type");
      return;
    }

    if (!variationName) {
      toast.error("Please enter a variation name");
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

    const variationData = {
      productId: id,
      type: variationType,
      name: variationName,
      allBranches,
      basePrice: allBranches ? basePrice : null,
      branchPrices: allBranches ? [] : branchPrices,
    };

    try {
      await axiosClient.post(`/products/${id}/variations`, variationData);
      toast.success("Variation created successfully");
      navigate(`/admin/products/variation/${id}`);
    } catch (error) {
      toast.error("Failed to create variation");
      console.error("Error creating variation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Product Variation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <p className="text-lg font-medium">{product?.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variationType">Variation Type</Label>
            <Select value={variationType} onValueChange={setVariationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select variation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cooking_gas">Cooking Gas</SelectItem>
                <SelectItem value="lubricant_oil">Lubricant Oil</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="kerosene">Kerosene</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variationName">Variation Name</Label>
            <Input
              id="variationName"
              placeholder="e.g., 12.5kg Gas, SAE 40 Oil"
              value={variationName}
              onChange={(e) => setVariationName(e.target.value)}
            />
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit">Create Variation</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/products/variation/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductVariation;