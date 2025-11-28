import { Outlet, RawMaterial, Menu, DocumentCategory, Alert } from '../types';

export const OUTLETS: Outlet[] = [
  { id: 1, name: "HSM Kangar", location: "Perlis", lastScore: 88.5, lastStatus: "GREEN" as any },
  { id: 2, name: "HSM Penang", location: "Penang", lastScore: 68.2, lastStatus: "RED" as any },
  { id: 3, name: "HSM Seremban", location: "Negeri Sembilan", lastScore: 73.0, lastStatus: "AMBER" as any },
  { id: 4, name: "HSM Melaka", location: "Melaka", lastScore: 92.1, lastStatus: "GREEN" as any },
  { id: 5, name: "HSM Mersing", location: "Johor", lastScore: 45.5, lastStatus: "RED" as any },
];

// Helper to generate random data for demonstration
export const generateOutletData = (outletId: number) => {
  // Deterministic "Random" based on outletId for consistency
  const seed = outletId * 1234;
  
  const materialCount = 30 + (seed % 20);
  const materials: RawMaterial[] = Array.from({ length: materialCount }).map((_, i) => {
    const r = (seed + i) % 100;
    let status: RawMaterial['status'] = 'SAFE';
    if (r < 5) status = 'NON_COMPLIANT';
    else if (r < 15) status = 'EXPIRED';
    else if (r < 25) status = 'WARNING';
    
    return {
      id: i,
      name: `Material ${i + 1}`,
      status
    };
  });

  const menuCount = 15 + (seed % 10);
  const menus: Menu[] = Array.from({ length: menuCount }).map((_, i) => {
    const r = (seed + i * 2) % 100;
    let status: Menu['status'] = 'COMPLIANT';
    if (r < 10) status = 'NON_COMPLIANT';
    else if (r < 30) status = 'PARTIALLY_COMPLIANT';

    return {
      id: i,
      name: `Menu Item ${i + 1}`,
      isActive: true,
      status
    };
  });

  const docCategories: DocumentCategory[] = [
    { id: 'kitchen', name: 'Kitchen Hygiene', required: 8, approved: Math.max(0, 8 - (seed % 3)) },
    { id: 'training', name: 'Worker Training', required: 5, approved: Math.max(0, 5 - (seed % 4)) },
    { id: 'supplier', name: 'Supplier Management', required: 6, approved: Math.max(0, 6 - (seed % 2)) },
    { id: 'manual', name: 'HAS Manual', required: 4, approved: Math.max(0, 4 - (seed % 3)) },
    { id: 'pest', name: 'Pest Control', required: 3, approved: 3 },
  ];

  const alertCount = seed % 8;
  const alerts: Alert[] = Array.from({ length: alertCount }).map((_, i) => {
    const r = (seed + i * 3) % 100;
    let severity: Alert['severity'] = 'LOW';
    if (r < 20) severity = 'HIGH';
    else if (r < 50) severity = 'MEDIUM';

    return {
      id: i,
      message: `Compliance Alert ${i + 1}`,
      status: 'ACTIVE',
      severity
    };
  });

  return { materials, menus, docCategories, alerts };
};
