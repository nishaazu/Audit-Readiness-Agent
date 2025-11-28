import React, { useState } from 'react';
import { AgentTerminal } from './components/AgentTerminal';
import { OutletDetail } from './components/OutletDetail';
import { ScoreGauge } from './components/ScoreGauge';
import { AgentStatus, Outlet, OutletScoreResult } from './types';
import { OUTLETS } from './services/mockData';
import { calculateScores } from './services/scoringService';
import { generateImprovementPlan } from './services/geminiService';
import { LayoutDashboard, Hotel, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [view, setView] = useState<'DASHBOARD' | 'DETAIL'>('DASHBOARD');
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null);
  const [scoreResult, setScoreResult] = useState<OutletScoreResult | null>(null);
  
  // Agent State
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => setAgentLogs(prev => [...prev, msg]);

  const runAudit = async (outlet: Outlet) => {
    setView('DETAIL');
    setSelectedOutletId(outlet.id);
    setScoreResult(null); // Clear previous result
    setAgentStatus(AgentStatus.FETCHING_DATA);
    setAgentLogs([]); // Clear logs
    
    addLog(`> INITIATING AUDIT SEQUENCE FOR OUTLET_ID: ${outlet.id}`);
    addLog(`> TARGET: ${outlet.name} (${outlet.location})`);
    
    try {
      // 1. Scoring Logic
      addLog(`> EXECUTING COMPONENT QUERIES...`);
      addLog(`  - Fetching Material Data...`);
      addLog(`  - Fetching Menu Data...`);
      addLog(`  - Fetching Document Records...`);
      addLog(`  - Fetching Active Alerts...`);
      
      setAgentStatus(AgentStatus.CALCULATING_SCORES);
      const result = await calculateScores(outlet);
      addLog(`> DATA RETRIEVED. CALCULATING SCORES...`);
      addLog(`  - Material Score: ${result.components.material.score}%`);
      addLog(`  - Menu Score: ${result.components.menu.score}%`);
      addLog(`  - Documentation: ${result.components.documentation.score}%`);
      addLog(`  - Alert Score: ${result.components.alerts.score}%`);
      addLog(`> OVERALL SCORE: ${result.overallScore}% (${result.status})`);
      
      // 2. Gemini Analysis
      if (!result.goalMet) {
        setAgentStatus(AgentStatus.ANALYZING_GAPS);
        addLog(`> SCORE < 85%. INITIATING AI ANALYSIS MODULE...`);
        addLog(`> SENDING DATA TO GEMINI 2.5 FLASH...`);
        
        const aiAnalysis = await generateImprovementPlan(result);
        result.gapsIdentified = aiAnalysis.gaps;
        result.improvementPlan = aiAnalysis.plan;
        result.nextReviewDate = aiAnalysis.nextReview;
        
        addLog(`> IMPROVEMENT PLAN GENERATED.`);
        addLog(`> ANALYSIS COMPLETE.`);
      } else {
        addLog(`> GOAL MET. NO IMPROVEMENT PLAN REQUIRED.`);
      }
      
      setScoreResult(result);
      setAgentStatus(AgentStatus.COMPLETED);
      addLog(`> AUDIT CYCLE COMPLETED SUCCESSFULLY.`);

    } catch (e) {
      console.error(e);
      setAgentStatus(AgentStatus.ERROR);
      addLog(`> CRITICAL ERROR: ${e}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
               <div className="bg-brand-600 p-2 rounded-lg">
                 <ShieldCheck className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h1 className="text-xl font-bold text-gray-900 tracking-tight">Audit Readiness Agent</h1>
                 <p className="text-xs text-gray-500 font-medium">Hotel Seri Malaysia Intelligent Compliance</p>
               </div>
            </div>
            {/* API Key Warning for Demo */}
            {!process.env.API_KEY && (
              <div className="hidden md:block text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded border border-amber-200">
                Demo Mode: Ensure API_KEY is set in environment for AI features
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {view === 'DASHBOARD' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-gray-400" />
                  Outlets Overview
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OUTLETS.map(outlet => (
                  <div key={outlet.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">{outlet.name}</h3>
                          <p className="text-sm text-gray-500">{outlet.location}</p>
                        </div>
                        <span className={clsx("px-2 py-1 rounded text-xs font-bold", {
                          'bg-green-100 text-green-700': outlet.lastStatus === 'GREEN',
                          'bg-amber-100 text-amber-700': outlet.lastStatus === 'AMBER',
                          'bg-red-100 text-red-700': outlet.lastStatus === 'RED',
                        })}>
                          {outlet.lastStatus}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <ScoreGauge score={outlet.lastScore || 0} size="sm" showLabel={false} />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{outlet.lastScore}%</div>
                          <div className="text-xs text-gray-500">Last Score</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => runAudit(outlet)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white py-2.5 rounded-lg font-medium transition-all text-sm"
                      >
                         <LayoutDashboard className="w-4 h-4" />
                         Launch Audit Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'DETAIL' && scoreResult && (
             <OutletDetail 
               data={scoreResult} 
               onBack={() => setView('DASHBOARD')}
               onRefresh={() => {
                 const outlet = OUTLETS.find(o => o.id === selectedOutletId);
                 if (outlet) runAudit(outlet);
               }}
             />
          )}

          {view === 'DETAIL' && !scoreResult && (
            <div className="h-96 flex flex-col items-center justify-center text-gray-400">
               <div className="animate-pulse flex flex-col items-center">
                 <ShieldCheck className="w-16 h-16 mb-4 text-gray-300" />
                 <p>Agent is processing outlet data...</p>
                 <p className="text-xs mt-2">Please observe the terminal.</p>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar / Agent Terminal */}
        <div className="w-80 hidden xl:block sticky top-24 h-[calc(100vh-8rem)]">
          <AgentTerminal status={agentStatus} logs={agentLogs} />
        </div>
      </main>
    </div>
  );
}

export default App;
