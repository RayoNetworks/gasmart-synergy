import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"


const stockDistribution = [
    { name: "LPG", value: 35, color: "#FF8B3D" },
    { name: "Lubricants", value: 25, color: "#4CAF50" },
    { name: "Accessories", value: 20, color: "#2196F3" },
    // { name: "LPG", value: 20, color: "#9C27B0" },
];
const StockManagement = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Stock Management</h1>
                <Button onClick={() => navigate("/admin/products/create")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Stock
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stockDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">LPG Stock Level</span>
                                    <span className="text-sm text-yellow-500">35%</span>
                                </div>
                                <Progress value={35} className="bg-yellow-100" indicatorClassName="bg-yellow-500" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Lubricants Stock Level</span>
                                    <span className="text-sm text-green-500">65%</span>
                                </div>
                                <Progress value={65} className="bg-green-100" indicatorClassName="bg-green-500" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Accessory Stock Level</span>
                                    <span className="text-sm text-red-500">15%</span>
                                </div>
                                <Progress value={15} className="bg-red-100" indicatorClassName="bg-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>)
}

export default StockManagement