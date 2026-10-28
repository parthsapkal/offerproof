'use client';

import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ExternalLink, PhoneCall, Building2 } from 'lucide-react';
import { AssessmentStatus } from '@/lib/types';

interface ActionChecklistProps {
  steps: string[];
  status: AssessmentStatus;
  companyName: string;
}

export function ActionChecklist({ steps, status, companyName }: ActionChecklistProps) {
  const [copied, setCopied] = useState(false);

  const incidentTemplate = `ATTENTION: Suspected Internship Offer Warning

Company Claimed: ${companyName || 'Not specified'}
Assessment Result: ${status === 'HIGH_WARNING' ? 'High Warning Signs / Suspicious' : status === 'LOWER_RISK' ? 'Lower Risk' : 'Inconclusive / Unverified'}
Analysis via OfferProof: Multiple rule-based checks performed on domain authenticity, upfront fees, and communication channels.

Please confirm whether this company or recruiter is registered and authorized by your college Placement Cell before taking any further action.`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(incidentTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-surface border border-neutral-border rounded-lg p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <h4 className="text-base font-semibold text-charcoal flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-forest" />
          <span>Recommended Next Steps</span>
        </h4>
        <p className="text-xs text-muted mt-1">
          Practical precautions to verify recruiter legitimacy before sharing documents or accepting.
        </p>
      </div>

      {/* Step items */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3 rounded-md bg-warm border border-neutral-border text-xs sm:text-sm text-charcoal"
          >
            <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </div>
        ))}
      </div>

      {/* Quick External Indian Portals */}
      <div className="pt-3 border-t border-neutral-border">
        <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2.5">
          Official Indian Verification & Reporting Portals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-md border border-danger-border bg-danger-bg hover:bg-danger-hover text-danger-text font-medium transition"
          >
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-danger" />
              <span>National Cyber Crime Portal (1930)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-danger/70" />
          </a>

          <a
            href="https://www.mca.gov.in/mcafoportal/checkCompanyName.do"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-md border border-neutral-border bg-warm hover:bg-neutral-hover text-charcoal font-medium transition"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-muted-700" />
              <span>MCA Master Company Record Search</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted" />
          </a>
        </div>
      </div>

      {/* Share / Copy Summary for College Placement Cell */}
      <div className="pt-3 border-t border-neutral-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-charcoal">
            Share Summary with College TPO or Placement Cell:
          </span>
          <button
            onClick={copyTemplate}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-forest hover:text-forest-700 bg-sage hover:bg-sage-border/50 px-2.5 py-1 rounded-md border border-sage-border transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5 text-forest" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Notice'}</span>
          </button>
        </div>
        <p className="text-[11px] text-muted">
          Forward this formatted summary to your Training & Placement Officer (TPO) to verify if the recruiter is campus-approved.
        </p>
      </div>
    </div>
  );
}
