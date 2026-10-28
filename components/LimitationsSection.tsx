'use client';

import React from 'react';
import { Info, AlertCircle, ShieldAlert, CheckSquare } from 'lucide-react';

interface LimitationsSectionProps {
  limitations: string[];
  unverifiedAspects: string[];
}

export function LimitationsSection({ limitations, unverifiedAspects }: LimitationsSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      {/* What Was Not / Could Not Be Verified */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <h4 className="text-sm sm:text-base font-bold text-amber-950">
            Details That Have NOT Been Verified
          </h4>
        </div>
        <p className="text-xs text-amber-900 mb-3">
          Responsible verification requires stating what digital heuristics cannot observe. The following elements require manual offline confirmation:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-amber-900">
          {unverifiedAspects.map((aspect, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
              <span>{aspect}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Methodological Limitations */}
      <div className="bg-navy-50/70 border border-navy-200 rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-5 h-5 text-navy-700 shrink-0" />
          <h4 className="text-sm sm:text-base font-bold text-navy-950">
            Verification Methodology & Limitations
          </h4>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-navy-700">
          {limitations.map((limit, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-500 mt-2 shrink-0" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
