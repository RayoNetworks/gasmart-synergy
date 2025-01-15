import { useState } from "react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const ProductCategories = () => {
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, refetch } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await axiosClient.get("/product-categories");
      return response.data;
    },
  });

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await axiosClient.post("/product-categories", {
        name: newCategory,
        description,
      });
      toast.success("Category created successfully");
      setNewCategory("");
      setDescription("");
      refetch();
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Input
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleCreateCategory} className="md:col-span-2">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-md border border-primary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: ProductCategory) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductCategories;