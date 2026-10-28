'use client';

import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

interface LimitationsSectionProps {
  limitations: string[];
  unverifiedAspects: string[];
}

export function LimitationsSection({ limitations, unverifiedAspects }: LimitationsSectionProps) {
  return (
    <div className="space-y-4 pt-2">
      {/* What Was Not / Could Not Be Verified */}
      <div className="bg-warning-bg border border-warning-border rounded-lg p-5">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-warning shrink-0" />
          <h4 className="text-sm sm:text-base font-semibold text-charcoal">
            Details That Have NOT Been Verified
          </h4>
        </div>
        <p className="text-xs text-charcoal-700 mb-3 leading-relaxed">
          Responsible verification requires stating what digital heuristics cannot observe. The following elements require manual offline confirmation:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-charcoal-700">
          {unverifiedAspects.map((aspect, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
              <span>{aspect}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Methodological Limitations */}
      <div className="bg-surface border border-neutral-border rounded-lg p-5">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-muted shrink-0" />
          <h4 className="text-sm sm:text-base font-semibold text-charcoal">
            Verification Methodology & Limitations
          </h4>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-charcoal-700">
          {limitations.map((limit, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-400 mt-2 shrink-0" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
