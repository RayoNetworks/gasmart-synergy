export const mockTanks = [
  {
    id: "1",
    name: "Tank 01",
    product: "Premium Motor Spirit",
    capacity: 50000,
    currentLevel: 75,
    lastDelivery: "2024-03-15",
    status: "ACTIVE",
    deliveryLogs: [
      {
        id: "DL001",
        date: "2024-03-15",
        quantity: 25000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED"
      },
      {
        id: "DL002",
        date: "2024-03-10",
        quantity: 30000,
        supplier: "PetroSupply Ltd",
        productType: "Premium Motor Spirit",
        status: "COMPLETED"
      }
    ]
  },
  {
    id: "2",
    name: "Tank 02",
    product: "Automotive Gas Oil",
    capacity: 40000,
    currentLevel: 15,
    lastDelivery: "2024-03-12",
    status: "ACTIVE",
    deliveryLogs: [
      {
        id: "DL003",
        date: "2024-03-12",
        quantity: 20000,
        supplier: "FuelMasters Co",
        productType: "Automotive Gas Oil",
        status: "COMPLETED"
      }
    ]
  },
  {
    id: "3",
    name: "Tank 03",
    product: "Kerosene",
    capacity: 30000,
    currentLevel: 45,
    lastDelivery: "2024-03-14",
    status: "MAINTENANCE",
    deliveryLogs: [
      {
        id: "DL004",
        date: "2024-03-14",
        quantity: 15000,
        supplier: "EnergyFuel Inc",
        productType: "Kerosene",
        status: "COMPLETED"
      }
    ]
  }
];