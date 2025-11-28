import React, { useEffect, useRef, useState } from 'react';
import { Terminal, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { AgentStatus } from '../types';
import { clsx } from 'clsx';

interface AgentTerminalProps {
  status: AgentStatus;
  logs: string[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ status, logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const isWorking = status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETED && status !== AgentStatus.ERROR;

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl flex flex-col h-full">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-mono text-slate-300">AGENT_PROCESS_MONITOR</span>
        </div>
        <div className="flex items-center gap-2">
           {isWorking && <Loader2 className="w-3 h-3 text-brand-400 animate-spin" />}
           <div className={clsx("w-2 h-2 rounded-full", {
             'bg-slate-500': status === AgentStatus.IDLE,
             'bg-brand-500 animate-pulse': isWorking,
             'bg-green-500': status === AgentStatus.COMPLETED,
             'bg-red-500': status === AgentStatus.ERROR
           })}></div>
           <span className="text-xs font-mono uppercase text-slate-400">{status.replace('_', ' ')}</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-slate-950/80"
      >
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for execution command...</div>
        )}
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className="text-slate-600 select-none">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            <span className={clsx({
              'text-brand-300': log.startsWith('>'),
              'text-green-400': log.includes('SUCCESS') || log.includes('COMPLETED'),
              'text-yellow-400': log.includes('WARNING') || log.includes('ANALYZING'),
              'text-red-400': log.includes('ERROR') || log.includes('CRITICAL'),
              'text-slate-300': !log.startsWith('>')
            })}>
              {log}
            </span>
          </div>
        ))}
        {isWorking && (
             <div className="flex gap-2">
                 <span className="text-slate-600">...</span>
                 <span className="text-brand-500 animate-pulse">_</span>
             </div>
        )}
      </div>
    </div>
  );
};
