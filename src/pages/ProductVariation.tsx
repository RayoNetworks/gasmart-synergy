import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const variationTypes = [
  { id: "size", name: "Size Variation" },
  { id: "type", name: "Type Variation" },
  { id: "grade", name: "Grade Variation" },
  { id: "packaging", name: "Packaging Variation" },
];

interface Variation {
  type: string;
  name: string;
  branchId: string;
  price: string;
}

const ProductVariation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [variationName, setVariationName] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [price, setPrice] = useState("");

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    }
  });

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await axiosClient.get('/branches');
      return response.data;
    }
  });

  const handleAddVariation = () => {
    if (!selectedType || !variationName || selectedBranches.length === 0 || !price) {
      toast.error("Please fill in all fields");
      return;
    }

    const newVariations = selectedBranches.map(branchId => ({
      type: selectedType,
      name: variationName,
      branchId,
      price,
    }));

    setVariations([...variations, ...newVariations]);
    setVariationName("");
    setPrice("");
    setSelectedBranches([]);
    toast.success("Variation added successfully");
  };

  const handleSubmit = async () => {
    if (variations.length === 0) {
      toast.error("Please add at least one variation");
      return;
    }

    try {
      await axiosClient.post(`/products/${id}/variations`, { variations });
      toast.success("Variations saved successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save variations");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Product Variation</h1>
      </div>

      <div className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <p className="text-gray-600">{product?.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Variation Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select variation type" />
              </SelectTrigger>
              <SelectContent>
                {variationTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Variation Name</Label>
            <Input
              placeholder="e.g., 5kg, Premium Grade, etc."
              value={variationName}
              onChange={(e) => setVariationName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Price (₦)</Label>
            <Input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Branches</Label>
            <div className="space-y-2">
              {branches?.map((branch: any) => (
                <div key={branch.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`branch-${branch.id}`}
                    checked={selectedBranches.includes(branch.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBranches([...selectedBranches, branch.id]);
                      } else {
                        setSelectedBranches(selectedBranches.filter(id => id !== branch.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={`branch-${branch.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {branch.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddVariation}>Add Variation</Button>
        </div>

        {variations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Added Variations</h2>
            <div className="space-y-2">
              {variations.map((variation, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <p><span className="font-semibold">Type:</span> {variationTypes.find(t => t.id === variation.type)?.name}</p>
                  <p><span className="font-semibold">Name:</span> {variation.name}</p>
                  <p><span className="font-semibold">Branch:</span> {branches?.find((b: any) => b.id === variation.branchId)?.name}</p>
                  <p><span className="font-semibold">Price:</span> ₦{variation.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <Button onClick={handleSubmit}>Save Variations</Button>
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariation;