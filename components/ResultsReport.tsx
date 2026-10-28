'use client';

import React, { useState } from 'react';
import { VerificationReport, FindingSeverity } from '@/lib/types';
import { FindingCard } from './FindingCard';
import { LimitationsSection } from './LimitationsSection';
import { ActionChecklist } from './ActionChecklist';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Printer,
  Shield,
  Clock,
  Building,
  Check,
  Copy,
} from 'lucide-react';

interface ResultsReportProps {
  report: VerificationReport;
  onReset: () => void;
}

export function ResultsReport({ report, onReset }: ResultsReportProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | FindingSeverity>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);

  const { overallAssessment, metrics, findings, observedFacts, limitations, unverifiedAspects, recommendedNextSteps } = report;

  const isHighWarning = overallAssessment.status === 'HIGH_WARNING';
  const isLowerRisk = overallAssessment.status === 'LOWER_RISK';

  const bannerTheme = isHighWarning
    ? {
        border: 'border-red-400 bg-gradient-to-r from-red-950 via-red-900 to-navy-950 text-white',
        badge: 'bg-red-500/20 text-red-300 border-red-500/40',
        icon: AlertOctagon,
        iconColor: 'text-red-400',
      }
    : isLowerRisk
    ? {
        border: 'border-teal-400 bg-gradient-to-r from-teal-950 via-teal-900 to-navy-950 text-white',
        badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        icon: CheckCircle2,
        iconColor: 'text-teal-400',
      }
    : {
        border: 'border-amber-400 bg-gradient-to-r from-amber-950 via-amber-900 to-navy-950 text-white',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: HelpCircle,
        iconColor: 'text-amber-400',
      };

  const BannerIcon = bannerTheme.icon;

  const filteredFindings =
    activeFilter === 'ALL'
      ? findings
      : findings.filter((f) => f.severity === activeFilter);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReportId = () => {
    navigator.clipboard.writeText(report.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="verification-results" className="space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-navy-200 shadow-sm print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-navy-500">Report ID:</span>
          <span className="text-xs font-mono font-bold text-navy-900 bg-navy-100 px-2 py-0.5 rounded">
            {report.id}
          </span>
          <button
            onClick={handleCopyReportId}
            className="text-xs text-navy-600 hover:text-navy-900 inline-flex items-center space-x-1"
            title="Copy Report ID"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-lg border border-navy-200 transition"
          >
            <Printer className="w-4 h-4 text-navy-600" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 px-3.5 py-1.5 rounded-lg transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span>Start New Verification</span>
          </button>
        </div>
      </div>

      {/* Main Overall Assessment Banner */}
      <div className={`rounded-2xl border-2 p-6 sm:p-8 shadow-xl relative overflow-hidden ${bannerTheme.border}`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border ${bannerTheme.badge}`}>
              <BannerIcon className="w-4 h-4" />
              <span>{overallAssessment.badgeLabel}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-navy-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Analyzed {new Date(report.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {overallAssessment.headline}
          </h2>

          <p className="text-sm sm:text-base text-navy-100 max-w-3xl leading-relaxed mb-6">
            {overallAssessment.summary}
          </p>

          {/* Severity Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-xs text-red-300 font-semibold block">Critical Red Flags</span>
              <span className="text-2xl font-black text-red-400">{metrics.criticalCount}</span>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-xs text-amber-300 font-semibold block">Warning Signs</span>
              <span className="text-2xl font-black text-amber-400">{metrics.warningCount}</span>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-xs text-yellow-300 font-semibold block">Cautions / Missing Info</span>
              <span className="text-2xl font-black text-yellow-300">{metrics.cautionCount}</span>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-xs text-teal-300 font-semibold block">Verified Positive Signals</span>
              <span className="text-2xl font-black text-teal-400">{metrics.verifiedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Observed Facts Table */}
      <div className="bg-white border border-navy-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Building className="w-5 h-5 text-navy-700" />
          <h3 className="text-base sm:text-lg font-bold text-navy-950">
            Observed Facts (Extracted Evidence)
          </h3>
        </div>
        <p className="text-xs text-navy-600 mb-4">
          These facts were directly extracted from the submission and verified against domain syntax, email routing rules, and fee parameters:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {observedFacts.map((fact, idx) => {
            const statusConfig =
              fact.status === 'FLAGGED'
                ? { bg: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-500' }
                : fact.status === 'VERIFIED'
                ? { bg: 'bg-teal-50 text-teal-800 border-teal-200', dot: 'bg-teal-500' }
                : fact.status === 'MISSING'
                ? { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' }
                : { bg: 'bg-navy-50 text-navy-800 border-navy-200', dot: 'bg-navy-400' };

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs ${statusConfig.bg}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold uppercase tracking-wider text-[10px] opacity-80">
                    {fact.label}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                </div>
                <p className="font-bold text-sm truncate" title={fact.value}>
                  {fact.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Findings with Severity Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-navy-950">
              Explainable Rule Findings ({findings.length})
            </h3>
            <p className="text-xs text-navy-600">
              Every finding identifies the rule triggered, observed evidence, explanation, and recommended action.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 print:hidden">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                activeFilter === 'ALL'
                  ? 'bg-navy-900 text-white'
                  : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              All ({findings.length})
            </button>
            {metrics.criticalCount > 0 && (
              <button
                onClick={() => setActiveFilter('CRITICAL')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeFilter === 'CRITICAL'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                Critical ({metrics.criticalCount})
              </button>
            )}
            {metrics.warningCount > 0 && (
              <button
                onClick={() => setActiveFilter('WARNING')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeFilter === 'WARNING'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                Warnings ({metrics.warningCount})
              </button>
            )}
            {metrics.cautionCount > 0 && (
              <button
                onClick={() => setActiveFilter('CAUTION')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeFilter === 'CAUTION'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                }`}
              >
                Cautions ({metrics.cautionCount})
              </button>
            )}
            {metrics.verifiedCount > 0 && (
              <button
                onClick={() => setActiveFilter('VERIFIED')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeFilter === 'VERIFIED'
                    ? 'bg-teal-600 text-white'
                    : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                Verified ({metrics.verifiedCount})
              </button>
            )}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </div>

      {/* Recommended Next Steps */}
      <ActionChecklist
        steps={recommendedNextSteps}
        status={overallAssessment.status}
        companyName={report.inputSnapshot.companyName}
      />

      {/* Limitations & Unverified Aspects */}
      <LimitationsSection
        limitations={limitations}
        unverifiedAspects={unverifiedAspects}
      />

      {/* Bottom Action Footer */}
      <div className="text-center pt-4 pb-8 print:hidden">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-navy-950 hover:bg-navy-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4 text-teal-400" />
          <span>Verify Another Offer</span>
        </button>
      </div>
    </div>
  );
}
