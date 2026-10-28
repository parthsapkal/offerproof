'use client';

import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ExternalLink, PhoneCall, AlertTriangle, Building2 } from 'lucide-react';
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
    <div className="bg-white border border-navy-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <h4 className="text-base sm:text-lg font-bold text-navy-950 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600" />
          <span>Recommended Next Steps</span>
        </h4>
        <p className="text-xs text-navy-600 mt-1">
          Follow these practical steps to protect your finances, academic record, and digital identity.
        </p>
      </div>

      {/* Step items */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3 rounded-lg bg-navy-50/60 border border-navy-100 text-xs sm:text-sm text-navy-900"
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </div>
        ))}
      </div>

      {/* Quick External Indian Portals */}
      <div className="pt-2 border-t border-navy-100">
        <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5">
          Official Indian Verification & Reporting Portals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-900 font-semibold transition"
          >
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>National Cyber Crime Portal (1930)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-red-500" />
          </a>

          <a
            href="https://www.mca.gov.in/mcafoportal/checkCompanyName.do"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg border border-navy-200 bg-navy-50 hover:bg-navy-100/70 text-navy-900 font-semibold transition"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-navy-700" />
              <span>MCA Master Company Record Search</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-navy-500" />
          </a>
        </div>
      </div>

      {/* Share / Copy Summary for College Placement Cell */}
      <div className="pt-2 border-t border-navy-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-navy-900">
            Share Summary with College TPO or Placement Cell:
          </span>
          <button
            onClick={copyTemplate}
            className="inline-flex items-center space-x-1 text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Notice'}</span>
          </button>
        </div>
        <p className="text-[11px] text-navy-600">
          Paste this template into an email to your Training & Placement Officer (TPO) to confirm if this company is officially visiting campus.
        </p>
      </div>
    </div>
  );
}
