import React from 'react';
import { OutletScoreResult, AuditStatus } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { AlertTriangle, CheckCircle, FileText, AlertOctagon, ArrowLeft, Calendar, BrainCircuit, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface OutletDetailProps {
  data: OutletScoreResult;
  onBack: () => void;
  onRefresh: () => void;
}

export const OutletDetail: React.FC<OutletDetailProps> = ({ data, onBack, onRefresh }) => {
  const { components } = data;

  const StatusBadge = ({ status }: { status: AuditStatus }) => {
    const styles = {
      [AuditStatus.GREEN]: "bg-green-100 text-green-800 border-green-200",
      [AuditStatus.AMBER]: "bg-amber-100 text-amber-800 border-amber-200",
      [AuditStatus.RED]: "bg-red-100 text-red-800 border-red-200",
    };
    
    return (
      <span className={clsx("px-3 py-1 rounded-full text-sm font-semibold border", styles[status])}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.outletName}</h1>
            <p className="text-sm text-gray-500">Last Audit: {new Date(data.scoredAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
             <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Status</div>
             <StatusBadge status={data.status} />
          </div>
          <div className="h-12 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-3">
             <ScoreGauge score={data.overallScore} size="sm" showLabel={false} />
             <div>
               <div className="text-3xl font-bold text-gray-900">{data.overallScore}%</div>
               <div className="text-xs text-gray-500">Readiness Score</div>
             </div>
          </div>
          <button 
            onClick={onRefresh}
            className="ml-4 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow-md"
          >
            Run Audit
          </button>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Material */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <AlertOctagon className="w-5 h-5" />
             </div>
             <span className="text-xs font-mono text-gray-400">WEIGHT: 30%</span>
          </div>
          <h3 className="font-semibold text-gray-700">Material Compliance</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{components.material.score}%</span>
            <span className="text-sm text-red-500">-{components.material.score < 100 ? (100 - components.material.score).toFixed(0) : 0} penalty</span>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between"><span>Expired:</span> <span className="font-medium text-red-600">{components.material.details.expired}</span></div>
            <div className="flex justify-between"><span>Non-Compliant:</span> <span className="font-medium text-red-600">{components.material.details.nonCompliant}</span></div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
               <FileText className="w-5 h-5" />
             </div>
             <span className="text-xs font-mono text-gray-400">WEIGHT: 25%</span>
          </div>
          <h3 className="font-semibold text-gray-700">Menu Compliance</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{components.menu.score}%</span>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between"><span>Non-Compliant:</span> <span className="font-medium text-red-600">{components.menu.details.nonCompliant}</span></div>
            <div className="flex justify-between"><span>Partial:</span> <span className="font-medium text-amber-600">{components.menu.details.partial}</span></div>
          </div>
        </div>

        {/* Docs */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
               <CheckCircle className="w-5 h-5" />
             </div>
             <span className="text-xs font-mono text-gray-400">WEIGHT: 25%</span>
          </div>
          <h3 className="font-semibold text-gray-700">Documentation</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{components.documentation.score}%</span>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
             <div className="text-xs text-gray-400 mb-1">Low Categories:</div>
             {components.documentation.details.categories
               .filter((c: any) => (c.approved/c.required) < 1)
               .slice(0, 2)
               .map((c: any) => (
                 <div key={c.id} className="flex justify-between">
                   <span className="truncate max-w-[120px]">{c.name}</span>
                   <span className="font-medium text-amber-600">{Math.round((c.approved/c.required)*100)}%</span>
                 </div>
             ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
               <AlertTriangle className="w-5 h-5" />
             </div>
             <span className="text-xs font-mono text-gray-400">WEIGHT: 20%</span>
          </div>
          <h3 className="font-semibold text-gray-700">Alert Resolution</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{components.alerts.score}%</span>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between"><span>High Severity:</span> <span className="font-medium text-red-600">{components.alerts.details.high}</span></div>
            <div className="flex justify-between"><span>Medium:</span> <span className="font-medium text-amber-600">{components.alerts.details.medium}</span></div>
          </div>
        </div>
      </div>

      {/* AI Agent Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Improvement Plan (Generated by Gemini) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <BrainCircuit className="w-6 h-6" />
              <h2 className="font-semibold text-lg">AI Readiness Improvement Plan</h2>
            </div>
            {data.nextReviewDate && (
               <div className="flex items-center gap-2 text-brand-100 text-sm bg-brand-800/50 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span>Next Review: {data.nextReviewDate}</span>
               </div>
            )}
          </div>
          <div className="p-6">
            {data.goalMet ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Goal Met!</h3>
                <p className="text-gray-500 max-w-md">
                  This outlet is currently meeting the audit readiness target. Keep up the great work in maintaining standards.
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-sans">
                 {/* Render the plan text but styling the headers slightly */}
                 {data.improvementPlan?.split('\n').map((line, i) => {
                   if (line.trim().startsWith('Top Actions')) return <h4 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line}</h4>;
                   if (line.trim().startsWith('Audit Readiness')) return <h3 key={i} className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">{line}</h3>;
                   return <p key={i} className="mb-2 leading-relaxed">{line}</p>
                 })}
              </div>
            )}
          </div>
        </div>

        {/* Gaps List */}
        <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
           <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
             <AlertCircle className="w-5 h-5 text-red-500" />
             Identified Gaps
           </h3>
           <div className="space-y-3">
             {data.gapsIdentified && data.gapsIdentified.length > 0 ? (
                data.gapsIdentified.map((gap, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 flex gap-3 items-start">
                     <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-0.5 rounded mt-0.5">
                       {idx + 1}
                     </span>
                     {gap}
                  </div>
                ))
             ) : (
               <div className="text-gray-500 text-sm italic">No significant gaps identified.</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
