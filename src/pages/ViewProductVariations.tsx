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

const ViewProductVariations = () => {
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Variations</h1>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{product?.name}</h2>
        <p className="text-gray-600">Category: {product?.category?.name}</p>
      </div>

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
            {product?.variations?.map((variation: any) => (
              variation.branchPrices.map((branchPrice: any) => (
                <TableRow key={`${variation.id}-${branchPrice.branchId}`}>
                  <TableCell>{variation.type}</TableCell>
                  <TableCell>{variation.name}</TableCell>
                  <TableCell>
                    {product.branches?.find((b: any) => b.id === branchPrice.branchId)?.name || 'All Branches'}
                  </TableCell>
                  <TableCell>₦{branchPrice.price}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewProductVariations;