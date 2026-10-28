'use client';

import React from 'react';
import { SAMPLE_CASES } from '@/lib/sampleCases';
import { SampleCase } from '@/lib/types';
import { AlertCircle, CheckCircle2, HelpCircle, ArrowRight, Building, Mail, IndianRupee } from 'lucide-react';

interface SampleCasesProps {
  onSelectCase: (sample: SampleCase, autoRun: boolean) => void;
  isLoading: boolean;
}

export function SampleCases({ onSelectCase, isLoading }: SampleCasesProps) {
  return (
    <section id="sample-cases-section" className="py-10 bg-warm border-b border-neutral-border text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center space-x-1.5 bg-surface border border-neutral-border text-muted px-2.5 py-1 rounded-md text-xs font-medium mb-2.5 shadow-sm">
            <span>Benchmark Evaluation Scenarios</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-charcoal mb-2">
            Illustrative Verification Examples
          </h2>
          <p className="text-muted text-xs sm:text-sm leading-relaxed">
            Select a scenario below to run it through the live verification engine API. These demonstrate how rule-based checks differentiate advance-fee fraud, verifiable campus offers, and unverified brand impersonation.
          </p>
          <p className="text-[11px] text-muted/80 mt-1">
            *Illustrative benchmark scenarios designed for automated verification testing, not real individual investigations.
          </p>
        </div>

        {/* 3 Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_CASES.map((sample) => {
            const isSuspicious = sample.category === 'suspicious';
            const isLowerRisk = sample.category === 'lower_risk';

            const badgeClass = isSuspicious
              ? 'bg-danger-bg text-danger-text border-danger-border'
              : isLowerRisk
              ? 'bg-sage text-forest border-sage-border'
              : 'bg-warning-bg text-warning-text border-warning-border';

            const Icon = isSuspicious ? AlertCircle : isLowerRisk ? CheckCircle2 : HelpCircle;

            return (
              <div
                key={sample.id}
                className="bg-surface rounded-md border border-neutral-border p-4 sm:p-5 flex flex-col justify-between shadow-sm transition hover:border-muted"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium border ${badgeClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sample.tag}</span>
                    </span>
                    <span className="text-[11px] font-mono text-muted uppercase">
                      Case #{sample.category.slice(0, 4)}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-sm sm:text-base font-semibold text-charcoal mb-1">
                    {sample.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-muted mb-3">
                    <Building className="w-3.5 h-3.5" />
                    <span>{sample.companyDisplay}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {sample.shortDescription}
                  </p>

                  {/* Key Indicators Mini-List */}
                  <div className="space-y-1.5 mb-5 text-xs bg-warm p-3 rounded border border-neutral-border">
                    <div className="flex items-center space-x-2 text-muted">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Email: <strong className="text-charcoal font-mono font-normal">{sample.input.recruiterEmail || 'None'}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted">
                      <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                      <span>Fee: <strong className={sample.input.feeRequested ? 'text-danger-text font-medium' : 'text-forest font-medium'}>
                        {sample.input.feeRequested ? `\u20B9${sample.input.feeAmount} Demanded` : '\u20B90 Requested'}
                      </strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    disabled={isLoading}
                    onClick={() => onSelectCase(sample, true)}
                    className="w-full inline-flex items-center justify-center space-x-1.5 text-xs font-medium py-2 px-3 rounded-md transition border border-neutral-border bg-surface hover:bg-neutral-subtle text-charcoal disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span>Run This Case</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
