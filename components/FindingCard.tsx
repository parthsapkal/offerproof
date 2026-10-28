'use client';

import React from 'react';
import { Finding } from '@/lib/types';
import { AlertOctagon, AlertTriangle, HelpCircle, CheckCircle2, ArrowRightCircle, ShieldAlert } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
}

export function FindingCard({ finding }: FindingCardProps) {
  const isCritical = finding.severity === 'CRITICAL';
  const isWarning = finding.severity === 'WARNING';
  const isCaution = finding.severity === 'CAUTION';
  const isVerified = finding.severity === 'VERIFIED';

  const badgeConfig = isCritical
    ? {
        bg: 'bg-red-50 text-red-800 border-red-200',
        badge: 'bg-red-600 text-white',
        border: 'border-red-200 hover:border-red-300',
        icon: AlertOctagon,
        label: 'CRITICAL WARNING',
      }
    : isWarning
    ? {
        bg: 'bg-amber-50/70 text-amber-900 border-amber-200',
        badge: 'bg-amber-600 text-white',
        border: 'border-amber-200 hover:border-amber-300',
        icon: AlertTriangle,
        label: 'WARNING SIGN',
      }
    : isCaution
    ? {
        bg: 'bg-yellow-50/70 text-yellow-900 border-yellow-200',
        badge: 'bg-yellow-600 text-white',
        border: 'border-yellow-200 hover:border-yellow-300',
        icon: HelpCircle,
        label: 'CAUTION / MISSING EVIDENCE',
      }
    : {
        bg: 'bg-teal-50/70 text-teal-900 border-teal-200',
        badge: 'bg-teal-600 text-white',
        border: 'border-teal-200 hover:border-teal-300',
        icon: CheckCircle2,
        label: 'VERIFIED INDICATOR',
      };

  const Icon = badgeConfig.icon;

  const categoryNames: Record<string, string> = {
    FEE: 'Payment & Fee Check',
    DOMAIN_EMAIL: 'Domain & Email Verification',
    COMMUNICATION_CHANNEL: 'Communication Channel',
    CONTENT_TACTICS: 'Offer Clauses & Tactics',
    COMPLETENESS: 'Evidence Completeness',
  };

  return (
    <div className={`rounded-xl border ${badgeConfig.border} bg-white shadow-sm overflow-hidden transition-all duration-150`}>
      {/* Card Header */}
      <div className={`px-4 sm:px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${badgeConfig.bg}`}>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeConfig.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badgeConfig.label}</span>
          </span>
          <span className="text-xs font-semibold text-navy-700">
            {categoryNames[finding.category] || finding.category}
          </span>
        </div>
        <span className="text-[10px] font-mono text-navy-500 uppercase">
          Rule: {finding.id}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-3.5">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-navy-950">
            {finding.title}
          </h4>
        </div>

        {/* Evidence */}
        <div className="bg-navy-50/70 rounded-lg p-3 text-xs sm:text-sm border border-navy-100">
          <p className="font-semibold text-navy-900 mb-1 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-600" />
            <span>Observed Evidence:</span>
          </p>
          <p className="text-navy-700 italic pl-3">{finding.evidence}</p>
        </div>

        {/* Explanation */}
        <div>
          <p className="text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1">
            Analysis & Context:
          </p>
          <p className="text-xs sm:text-sm text-navy-700 leading-relaxed">
            {finding.explanation}
          </p>
        </div>

        {/* Recommended Action */}
        <div className={`p-3 rounded-lg border flex items-start space-x-2.5 text-xs sm:text-sm ${
          isCritical
            ? 'bg-red-50/80 border-red-200 text-red-950 font-medium'
            : isWarning
            ? 'bg-amber-50/80 border-amber-200 text-amber-950 font-medium'
            : isVerified
            ? 'bg-teal-50/80 border-teal-200 text-teal-950'
            : 'bg-navy-50 border-navy-200 text-navy-900'
        }`}>
          <ArrowRightCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
            isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : isVerified ? 'text-teal-600' : 'text-navy-600'
          }`} />
          <div>
            <span className="font-bold">Recommended Action: </span>
            <span>{finding.recommendedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
