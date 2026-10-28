'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, AlertOctagon, Link2 } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
  onScrollToSamples: () => void;
}

export function Hero({ onScrollToForm, onScrollToSamples }: HeroProps) {
  return (
    <section className="bg-warm border-b border-neutral-border text-charcoal pt-10 pb-12 sm:pt-14 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-surface border border-neutral-border px-3 py-1 rounded-md text-xs font-medium text-muted mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span>Employment Offer Verification for Indian Students & Placement Cells</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-charcoal leading-tight mb-4">
            Verify before you accept.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted leading-relaxed mb-6 font-normal max-w-2xl">
            Evaluate internship and entry-level job offers against official company career listings, verify recruiter domains, and detect advance-fee extortion patterns before sharing private documents or transferring funds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={onScrollToForm}
              className="inline-flex items-center space-x-2 bg-forest hover:bg-forest-700 text-white font-medium px-5 py-2.5 rounded-md text-sm transition shadow-sm"
            >
              <span>Verify an Offer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToSamples}
              className="inline-flex items-center space-x-2 bg-surface hover:bg-neutral-subtle text-charcoal font-medium px-4 py-2.5 rounded-md text-sm border border-neutral-border transition shadow-sm"
            >
              <span>Explore Benchmark Cases</span>
            </button>
          </div>
        </div>

        {/* Realistic Verification Summary Preview */}
        <div className="mt-2 pt-6 border-t border-neutral-border grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: How the verification process works */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              How Verification Works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-surface rounded-md border border-neutral-border">
                <span className="w-5 h-5 rounded bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-charcoal">Submit Offer Details</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Enter the company, stipend, recruiter email, and optional letter text or PDF.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-surface rounded-md border border-neutral-border">
                <span className="w-5 h-5 rounded bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-charcoal">Official Listing Match</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Compare terms against the company's verified careers portal or authorized ATS.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-surface rounded-md border border-neutral-border">
                <span className="w-5 h-5 rounded bg-sage text-forest flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-charcoal">Investigation Summary</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Review factual discrepancies, payment warnings, and independent contact paths.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Small, realistic example of a verification report card */}
          <div className="lg:col-span-7 bg-surface rounded-md border border-neutral-border p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-border pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-danger" />
                <span className="text-xs font-semibold text-charcoal">
                  Sample Investigation Summary &bull; Apex Global Tech
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted">
                OP-DEMO-2025
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-warm border border-neutral-border">
                <span className="text-[10px] text-muted block uppercase">Company Status</span>
                <span className="font-medium text-charcoal">Domain Registered</span>
              </div>
              <div className="p-2 rounded bg-danger-bg border border-danger-border">
                <span className="text-[10px] text-danger-text block uppercase">Payment Mandate</span>
                <span className="font-semibold text-danger-text">&#8377;2,500 Requested</span>
              </div>
              <div className="p-2 rounded bg-warning-bg border border-warning-border">
                <span className="text-[10px] text-warning-text block uppercase">Recruiter Channel</span>
                <span className="font-medium text-warning-text">Telegram / Free Mail</span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed bg-warm p-2.5 rounded border border-neutral-border">
              <strong className="text-charcoal font-medium">Finding: </strong>
              The offer letter requires an upfront &#8377;2,500 registration deposit. Under AICTE and standard corporate hiring policies, genuine employers never charge candidate fees. Recruiter uses public webmail.
            </p>

            <div className="flex items-center justify-between text-[11px] text-muted pt-1">
              <span>Deterministic Heuristic Evaluation</span>
              <span className="text-forest font-medium">No storage of private documents</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
