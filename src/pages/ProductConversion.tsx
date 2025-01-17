import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const ProductConversion = () => {
  const { toast } = useToast();
  const [kgToLiterRatio, setKgToLiterRatio] = useState<number>(1);
  const [testValue, setTestValue] = useState<number>(0);

  const handleSaveRatio = () => {
    console.log("Saving conversion ratio:", kgToLiterRatio);
    toast({
      title: "Conversion Ratio Updated",
      description: `1 kg = ${kgToLiterRatio} liters`,
    });
  };

  const calculateConversion = () => {
    const result = testValue * kgToLiterRatio;
    toast({
      title: "Conversion Result",
      description: `${testValue} kg = ${result.toFixed(2)} liters`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Product Unit Conversion</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Set Conversion Ratio</CardTitle>
            <CardDescription>
              Define how many liters equal 1 kilogram for your products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                1 kg equals (in liters):
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={kgToLiterRatio}
                onChange={(e) => setKgToLiterRatio(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleSaveRatio}>Save Ratio</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Conversion</CardTitle>
            <CardDescription>
              Test your conversion settings with any value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter value (in kg):</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={testValue}
                onChange={(e) => setTestValue(Number(e.target.value))}
              />
            </div>
            <Button onClick={calculateConversion}>Calculate</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductConversion;