'use client';

import React from 'react';
import { Finding } from '@/lib/types';
import { AlertOctagon, AlertTriangle, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

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
        headerBg: 'bg-danger-bg text-charcoal border-danger-border',
        badge: 'bg-danger text-white',
        cardBorder: 'border-danger-border',
        icon: AlertOctagon,
        label: 'CRITICAL WARNING',
        actionBox: 'bg-danger-bg border-danger-border text-danger-text',
        actionIcon: 'text-danger',
      }
    : isWarning
    ? {
        headerBg: 'bg-warning-bg text-charcoal border-warning-border',
        badge: 'bg-warning text-white',
        cardBorder: 'border-warning-border',
        icon: AlertTriangle,
        label: 'WARNING SIGN',
        actionBox: 'bg-warning-bg border-warning-border text-warning-text',
        actionIcon: 'text-warning',
      }
    : isCaution
    ? {
        headerBg: 'bg-warm text-charcoal border-neutral-border',
        badge: 'bg-muted-700 text-white',
        cardBorder: 'border-neutral-border',
        icon: HelpCircle,
        label: 'CAUTION / MISSING EVIDENCE',
        actionBox: 'bg-warm border-neutral-border text-charcoal',
        actionIcon: 'text-muted-700',
      }
    : {
        headerBg: 'bg-sage-light text-charcoal border-sage-border',
        badge: 'bg-forest text-white',
        cardBorder: 'border-sage-border',
        icon: CheckCircle2,
        label: 'VERIFIED INDICATOR',
        actionBox: 'bg-sage border-sage-border text-forest-800',
        actionIcon: 'text-forest',
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
    <div className={`rounded-lg border ${badgeConfig.cardBorder} bg-surface shadow-sm overflow-hidden`}>
      {/* Card Header */}
      <div className={`px-4 sm:px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 ${badgeConfig.headerBg}`}>
        <div className="flex items-center space-x-2.5">
          <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded ${badgeConfig.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badgeConfig.label}</span>
          </span>
          <span className="text-xs font-medium text-charcoal-700">
            {categoryNames[finding.category] || finding.category}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted">
          Rule: {finding.id}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-3.5">
        <h4 className="text-base font-semibold text-charcoal">
          {finding.title}
        </h4>

        {/* Evidence */}
        <div className="bg-warm rounded-md p-3 text-xs sm:text-sm border border-neutral-border">
          <p className="font-medium text-charcoal mb-1 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-600" />
            <span>Observed Evidence:</span>
          </p>
          <p className="text-charcoal-700 italic pl-3 leading-relaxed">
            {finding.evidence}
          </p>
        </div>

        {/* Explanation */}
        <div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
            Analysis & Context:
          </p>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {finding.explanation}
          </p>
        </div>

        {/* Recommended Action */}
        <div className={`p-3 rounded-md border flex items-start space-x-2.5 text-xs sm:text-sm ${badgeConfig.actionBox}`}>
          <ArrowRight className={`w-4 h-4 shrink-0 mt-0.5 ${badgeConfig.actionIcon}`} />
          <div>
            <span className="font-semibold">Recommended Action: </span>
            <span className="leading-relaxed">{finding.recommendedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
