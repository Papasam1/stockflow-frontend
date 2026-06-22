export const seedProducts = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-001', category: 'Electronics', qty: 45, price: 12500, supplier: 'TechHub Nigeria', status: 'In Stock' },
  { id: 2, name: 'Office Chair', sku: 'OC-002', category: 'Furniture', qty: 8, price: 35000, supplier: 'FurnPro Ltd', status: 'Low Stock' },
  { id: 3, name: 'A4 Paper (Ream)', sku: 'PP-003', category: 'Stationery', qty: 0, price: 1800, supplier: 'PrintWorks', status: 'Out of Stock' },
  { id: 4, name: 'Standing Desk', sku: 'SD-004', category: 'Furniture', qty: 20, price: 95000, supplier: 'FurnPro Ltd', status: 'In Stock' },
  { id: 5, name: 'USB-C Hub', sku: 'UH-005', category: 'Electronics', qty: 5, price: 8500, supplier: 'TechHub Nigeria', status: 'Low Stock' },
];

export const seedCategories = [
  { id: 1, name: 'Electronics', icon: '💻', count: 2 },
  { id: 2, name: 'Furniture', icon: '🪑', count: 2 },
  { id: 3, name: 'Stationery', icon: '📝', count: 1 },
  { id: 4, name: 'Cleaning', icon: '🧹', count: 0 },
  { id: 5, name: 'Beverages', icon: '☕', count: 0 },
];

export const seedSuppliers = [
  { id: 1, name: 'TechHub Nigeria', contact: '+234 801 234 5678', email: 'sales@techhub.ng', products: 2 },
  { id: 2, name: 'FurnPro Ltd', contact: '+234 802 345 6789', email: 'order@furnpro.com', products: 2 },
  { id: 3, name: 'PrintWorks', contact: '+234 803 456 7890', email: 'info@printworks.ng', products: 1 },
];

export const seedActivity = [
  { action: 'Stock In', product: 'Wireless Headphones', qty: 20, date: '17 Jun 2025', user: 'Admin', type: 'in' },
  { action: 'Updated', product: 'Office Chair', qty: null, date: '16 Jun 2025', user: 'Admin', type: 'update' },
  { action: 'Stock Out', product: 'A4 Paper (Ream)', qty: 50, date: '15 Jun 2025', user: 'Manager', type: 'out' },
  { action: 'Stock In', product: 'Standing Desk', qty: 10, date: '14 Jun 2025', user: 'Admin', type: 'in' },
  { action: 'Stock Out', product: 'USB-C Hub', qty: 3, date: '13 Jun 2025', user: 'Manager', type: 'out' },
];
