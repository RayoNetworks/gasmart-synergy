import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ViewProductVariations = () => {
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      console.log('Product data:', response.data);
      return response.data;
    }
  });

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Variations</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-600">Category: {product.category?.name}</p>
            <p className="text-gray-600">Base Price: {product.allBranches ? `₦${product.basePrice}` : 'Branch-specific pricing'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variation Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.variations?.map((variation: any) => (
              variation.allBranches ? (
                <TableRow key={variation.id}>
                  <TableCell>{variation.type}</TableCell>
                  <TableCell>{variation.name}</TableCell>
                  <TableCell>All Branches</TableCell>
                  <TableCell>₦{variation.basePrice}</TableCell>
                </TableRow>
              ) : (
                variation.branchPrices.map((branchPrice: any, index: number) => (
                  <TableRow key={`${variation.id}-${branchPrice.branchId}`}>
                    <TableCell>{variation.type}</TableCell>
                    <TableCell>{variation.name}</TableCell>
                    <TableCell>
                      {product.branches?.find((b: any) => b.id === branchPrice.branchId)?.name || 'Unknown Branch'}
                    </TableCell>
                    <TableCell>₦{branchPrice.price}</TableCell>
                  </TableRow>
                ))
              )
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewProductVariations;