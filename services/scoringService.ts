import { 
  MaterialStats, MenuStats, AlertStats, ComponentScore, OutletScoreResult, 
  AuditStatus, Outlet, DocumentCategory 
} from '../types';
import { generateOutletData } from './mockData';

export const calculateScores = async (outlet: Outlet): Promise<OutletScoreResult> => {
  // Simulate network delay for "Agent" feel
  await new Promise(resolve => setTimeout(resolve, 800));

  const data = generateOutletData(outlet.id);
  
  // 1. MATERIAL COMPLIANCE (30%)
  const matStats: MaterialStats = {
    total: data.materials.length,
    compliant: data.materials.filter(m => ['SAFE', 'WARNING'].includes(m.status)).length,
    expired: data.materials.filter(m => m.status === 'EXPIRED').length,
    nonCompliant: data.materials.filter(m => m.status === 'NON_COMPLIANT').length
  };

  const matBase = matStats.total > 0 ? (matStats.compliant / matStats.total) * 100 : 0;
  const matPenalty = (matStats.expired * 5) + (matStats.nonCompliant * 10);
  const matScore = Math.max(0, matBase - matPenalty);

  // 2. MENU COMPLIANCE (25%)
  const menuStats: MenuStats = {
    total: data.menus.length,
    compliant: data.menus.filter(m => m.status === 'COMPLIANT').length,
    partial: data.menus.filter(m => m.status === 'PARTIALLY_COMPLIANT').length,
    nonCompliant: data.menus.filter(m => m.status === 'NON_COMPLIANT').length
  };
  const menuScore = menuStats.total > 0 ? (menuStats.compliant / menuStats.total) * 100 : 0;

  // 3. DOCUMENTATION (25%)
  const docScores = data.docCategories.map(c => c.required > 0 ? (c.approved / c.required) * 100 : 0);
  const docScore = docScores.reduce((a, b) => a + b, 0) / (docScores.length || 1);

  // 4. ALERTS (20%)
  const alertStats: AlertStats = {
    total: data.alerts.length,
    high: data.alerts.filter(a => a.severity === 'HIGH').length,
    medium: data.alerts.filter(a => a.severity === 'MEDIUM').length,
    low: data.alerts.filter(a => a.severity === 'LOW').length,
  };
  const alertPenalty = (alertStats.high * 5) + (alertStats.medium * 2) + (alertStats.low * 1);
  const alertScore = Math.max(0, 100 - alertPenalty);

  // Overall
  const overall = (matScore * 0.30) + (menuScore * 0.25) + (docScore * 0.25) + (alertScore * 0.20);
  const finalScore = Math.max(0, Math.min(100, overall));

  // Status
  let status = AuditStatus.RED;
  if (finalScore >= 85) status = AuditStatus.GREEN;
  else if (finalScore >= 70) status = AuditStatus.AMBER;

  return {
    outletId: outlet.id,
    outletName: outlet.name,
    overallScore: Number(finalScore.toFixed(2)),
    status,
    goalMet: finalScore >= 85,
    scoredAt: new Date().toISOString(),
    components: {
      material: {
        name: "Material Compliance",
        score: Number(matScore.toFixed(2)),
        weight: 0.30,
        contribution: Number((matScore * 0.30).toFixed(2)),
        details: matStats
      },
      menu: {
        name: "Menu Compliance",
        score: Number(menuScore.toFixed(2)),
        weight: 0.25,
        contribution: Number((menuScore * 0.25).toFixed(2)),
        details: menuStats
      },
      documentation: {
        name: "Documentation",
        score: Number(docScore.toFixed(2)),
        weight: 0.25,
        contribution: Number((docScore * 0.25).toFixed(2)),
        details: { categories: data.docCategories }
      },
      alerts: {
        name: "Alert Resolution",
        score: Number(alertScore.toFixed(2)),
        weight: 0.20,
        contribution: Number((alertScore * 0.20).toFixed(2)),
        details: alertStats
      }
    }
  };
};
