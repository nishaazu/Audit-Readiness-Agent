import React from 'react';
import { clsx } from 'clsx';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 'md', label, showLabel = true }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const dashoffset = circumference - (progress / 100) * circumference;

  let colorClass = 'text-status-red';
  if (score >= 85) colorClass = 'text-status-green';
  else if (score >= 70) colorClass = 'text-status-amber';

  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-40 h-40 text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={clsx("relative flex items-center justify-center", sizeClasses[size])}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <circle
            className={clsx("transition-all duration-1000 ease-out", colorClass)}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashoffset,
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={clsx("font-bold text-gray-800", size === 'lg' ? 'text-3xl' : 'text-xl')}>
            {score.toFixed(0)}%
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="mt-2 text-sm font-medium text-gray-500">{label}</span>
      )}
    </div>
  );
};
