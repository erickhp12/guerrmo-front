export const mockProducts = [
  {
    id: 1,
    name: "Balatas Cerámicas Delanteras",
    category: "Frenos",
    brand: "Brembo",
    description: "Balatas de alto rendimiento con tecnología cerámica. Menor ruido y polvo.",
    price: 850,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    stock: 15,
    sku: "BRK-001",
    compatibility: "Compatible con Honda Civic 2016-2022, Accord 2018-2023"
  },
  {
    id: 2,
    name: "Filtro de Aceite Premium",
    category: "Filtros",
    brand: "Mann Filter",
    description: "Filtro de aceite de alta eficiencia con tecnología alemana.",
    price: 180,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400",
    stock: 45,
    sku: "FLT-002",
    compatibility: "Universal para motores 1.6L - 2.0L"
  },
  {
    id: 3,
    name: "Amortiguadores Traseros Par",
    category: "Suspensión",
    brand: "Monroe",
    description: "Par de amortiguadores hidráulicos de gas para mejor estabilidad.",
    price: 2400,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
    stock: 8,
    sku: "SUS-003",
    compatibility: "Nissan Versa 2012-2019"
  },
  {
    id: 4,
    name: "Batería 12V 45Ah",
    category: "Sistema Eléctrico",
    brand: "LTH",
    description: "Batería libre de mantenimiento con 24 meses de garantía.",
    price: 1650,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
    stock: 12,
    sku: "BAT-004",
    compatibility: "Vehículos compactos y sedanes"
  },
  {
    id: 5,
    name: "Bujías Iridium Set 4pz",
    category: "Motor",
    brand: "NGK",
    description: "Juego de 4 bujías de iridio para mejor combustión y rendimiento.",
    price: 680,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400",
    stock: 30,
    sku: "MOT-005",
    compatibility: "Toyota Corolla, Mazda 3, Honda Civic"
  },
  {
    id: 6,
    name: "Bomba de Agua con Empaque",
    category: "Sistema de Enfriamiento",
    brand: "Gates",
    description: "Bomba de agua de alta calidad incluye empaque y tornillería.",
    price: 950,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400",
    stock: 10,
    sku: "ENF-006",
    compatibility: "Chevrolet Aveo 2012-2018"
  },
  {
    id: 7,
    name: "Kit de Clutch Completo",
    category: "Transmisión",
    brand: "Luk",
    description: "Kit completo: disco, prensa y balero collarin.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400",
    stock: 5,
    sku: "TRA-007",
    compatibility: "Volkswagen Jetta A4 2000-2008"
  },
  {
    id: 8,
    name: "Radiador de Aluminio",
    category: "Sistema de Enfriamiento",
    brand: "Denso",
    description: "Radiador de aluminio con núcleo de alta eficiencia térmica.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    stock: 6,
    sku: "ENF-008",
    compatibility: "Nissan Sentra 2013-2019"
  },
  {
    id: 9,
    name: "Pastillas de Freno Traseras",
    category: "Frenos",
    brand: "Akebono",
    description: "Pastillas de freno cerámicas de bajo ruido.",
    price: 620,
    image: "https://images.unsplash.com/photo-1449130015084-2dc954a6d51f?w=400",
    stock: 20,
    sku: "BRK-009",
    compatibility: "Mazda 3 2014-2021"
  },
  {
    id: 10,
    name: "Filtro de Aire de Alto Flujo",
    category: "Filtros",
    brand: "K&N",
    description: "Filtro de aire reutilizable de alto rendimiento.",
    price: 890,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 18,
    sku: "FLT-010",
    compatibility: "Universal - Verificar medidas"
  },
  {
    id: 11,
    name: "Terminales de Dirección Par",
    category: "Dirección",
    brand: "Moog",
    description: "Par de terminales de dirección con garantía extendida.",
    price: 1100,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    stock: 14,
    sku: "DIR-011",
    compatibility: "Ford Focus 2012-2018"
  },
  {
    id: 12,
    name: "Aceite Motor Sintético 5W-30",
    category: "Lubricantes",
    brand: "Mobil 1",
    description: "Aceite sintético premium 5W-30, garrafa de 4 litros.",
    price: 580,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 50,
    sku: "LUB-012",
    compatibility: "Motores a gasolina modernos"
  }
];

export const mockOrders = [
  {
    id: 1001,
    customerName: "Juan Pérez García",
    phone: "442-123-4567",
    email: "juan.perez@email.com",
    address: "Av. Constituyentes 123, Col. Centro, Ciudad Juárez",
    status: "nuevo",
    date: "2024-01-15",
    items: [
      { productId: 1, quantity: 1, productName: "Balatas Cerámicas Delanteras" },
      { productId: 2, quantity: 2, productName: "Filtro de Aceite Premium" }
    ],
    comments: "Necesito las balatas para mañana si es posible"
  },
  {
    id: 1002,
    customerName: "María González López",
    phone: "442-234-5678",
    email: "maria.gonzalez@email.com",
    address: "Calle Hidalgo 456, Col. Alameda, Ciudad Juárez",
    status: "en_proceso",
    date: "2024-01-14",
    items: [
      { productId: 4, quantity: 1, productName: "Batería 12V 45Ah" }
    ],
    comments: "¿Incluye instalación?"
  },
  {
    id: 1003,
    customerName: "Carlos Ramírez Soto",
    phone: "442-345-6789",
    email: "carlos.ramirez@email.com",
    address: "Blvd. Bernardo Quintana 789, Col. Carretas, Ciudad Juárez",
    status: "entregado",
    date: "2024-01-13",
    items: [
      { productId: 7, quantity: 1, productName: "Kit de Clutch Completo" },
      { productId: 5, quantity: 1, productName: "Bujías Iridium Set 4pz" }
    ],
    comments: ""
  },
  {
    id: 1004,
    customerName: "Ana Martínez Cruz",
    phone: "442-456-7890",
    email: "ana.martinez@email.com",
    address: "Av. Universidad 321, Col. Centro Sur, Ciudad Juárez",
    status: "nuevo",
    date: "2024-01-15",
    items: [
      { productId: 3, quantity: 2, productName: "Amortiguadores Traseros Par" }
    ],
    comments: "Favor de confirmar disponibilidad antes de enviar"
  },
  {
    id: 1005,
    customerName: "Roberto Flores Díaz",
    phone: "442-567-8901",
    email: "roberto.flores@email.com",
    address: "Calle Corregidora 654, Col. El Pueblito, Ciudad Juárez",
    status: "en_proceso",
    date: "2024-01-14",
    items: [
      { productId: 8, quantity: 1, productName: "Radiador de Aluminio" },
      { productId: 6, quantity: 1, productName: "Bomba de Agua con Empaque" }
    ],
    comments: "Necesito factura"
  }
];

export const categories = [
  { id: 1, name: "Frenos", icon: "🛑", count: 45 },
  { id: 2, name: "Filtros", icon: "🔧", count: 78 },
  { id: 3, name: "Suspensión", icon: "⚙️", count: 34 },
  { id: 4, name: "Sistema Eléctrico", icon: "⚡", count: 56 },
  { id: 5, name: "Motor", icon: "🔩", count: 92 },
  { id: 6, name: "Sistema de Enfriamiento", icon: "❄️", count: 41 },
  { id: 7, name: "Transmisión", icon: "⚡", count: 28 },
  { id: 8, name: "Dirección", icon: "🎯", count: 33 }
];
