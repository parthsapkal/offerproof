'use client';

import React from 'react';
import { SAMPLE_CASES } from '@/lib/sampleCases';
import { SampleCase } from '@/lib/types';
import { AlertCircle, CheckCircle2, HelpCircle, ArrowRight, Sparkles, Building, Mail, IndianRupee } from 'lucide-react';

interface SampleCasesProps {
  onSelectCase: (sample: SampleCase, autoRun: boolean) => void;
  isLoading: boolean;
}

export function SampleCases({ onSelectCase, isLoading }: SampleCasesProps) {
  return (
    <section id="sample-cases-section" className="py-12 bg-navy-900 border-b border-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge & Evaluator Demo Scenarios</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Test Predefined Verification Cases
          </h2>
          <p className="text-navy-300 text-sm sm:text-base leading-relaxed">
            Select an illustrative scenario below to run it through the live verification engine API.
            These demonstrate how deterministic rules differentiate blatant fraud, verifiable legitimate offers, and inconclusive brand impersonation.
          </p>
          <p className="text-[11px] text-navy-400 mt-1 italic">
            *Note: These are illustrative benchmark scenarios designed for automated verification testing, not real criminal investigations.
          </p>
        </div>

        {/* 3 Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_CASES.map((sample) => {
            const isSuspicious = sample.category === 'suspicious';
            const isLowerRisk = sample.category === 'lower_risk';

            const borderClass = isSuspicious
              ? 'border-red-600/50 hover:border-red-500 bg-gradient-to-b from-navy-950 to-red-950/20'
              : isLowerRisk
              ? 'border-teal-500/50 hover:border-teal-400 bg-gradient-to-b from-navy-950 to-teal-950/20'
              : 'border-amber-500/50 hover:border-amber-400 bg-gradient-to-b from-navy-950 to-amber-950/20';

            const badgeBg = isSuspicious
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : isLowerRisk
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

            const Icon = isSuspicious ? AlertCircle : isLowerRisk ? CheckCircle2 : HelpCircle;
            const iconColor = isSuspicious ? 'text-red-400' : isLowerRisk ? 'text-teal-400' : 'text-amber-400';

            return (
              <div
                key={sample.id}
                className={`relative rounded-2xl border ${borderClass} p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1`}
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sample.tag}</span>
                    </span>
                    <span className="text-[11px] font-mono text-navy-400 uppercase tracking-wider">
                      Demo #{sample.category.toUpperCase().slice(0, 4)}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300">
                    {sample.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-navy-300 mb-3">
                    <Building className="w-3.5 h-3.5 text-navy-400" />
                    <span className="font-medium text-navy-200">{sample.companyDisplay}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-navy-300 leading-relaxed mb-4">
                    {sample.shortDescription}
                  </p>

                  {/* Key Indicators Mini-List */}
                  <div className="space-y-1.5 mb-5 text-xs bg-navy-900/80 p-3 rounded-lg border border-navy-800">
                    <div className="flex items-center space-x-2 text-navy-300">
                      <Mail className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                      <span className="truncate">Email: <strong className="text-white font-mono">{sample.input.recruiterEmail || 'None'}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-navy-300">
                      <IndianRupee className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                      <span>Fee: <strong className={sample.input.feeRequested ? 'text-red-400 font-semibold' : 'text-teal-400 font-semibold'}>
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
                    className={`w-full inline-flex items-center justify-center space-x-2 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition ${
                      isSuspicious
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/30'
                        : isLowerRisk
                        ? 'bg-teal-500 hover:bg-teal-400 text-navy-950 shadow-md shadow-teal-900/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-md shadow-amber-900/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>Analyze This Case</span>
                    <ArrowRight className="w-4 h-4" />
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
