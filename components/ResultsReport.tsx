'use client';

import React, { useState } from 'react';
import { VerificationReport, FindingSeverity } from '@/lib/types';
import { FindingCard } from './FindingCard';
import { OfficialListingMatchCard } from './OfficialListingMatchCard';
import { LimitationsSection } from './LimitationsSection';
import { ActionChecklist } from './ActionChecklist';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Printer,
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

  const {
    overallAssessment,
    metrics,
    findings,
    observedFacts,
    limitations,
    unverifiedAspects,
    recommendedNextSteps,
  } = report;

  const isHighWarning = overallAssessment.status === 'HIGH_WARNING';
  const isLowerRisk = overallAssessment.status === 'LOWER_RISK';

  const bannerTheme = isHighWarning
    ? {
        border: 'border-danger-border bg-danger-bg text-charcoal',
        badge: 'bg-danger text-white',
        icon: AlertOctagon,
        iconColor: 'text-danger',
      }
    : isLowerRisk
    ? {
        border: 'border-sage-border bg-sage-light text-charcoal',
        badge: 'bg-forest text-white',
        icon: CheckCircle2,
        iconColor: 'text-forest',
      }
    : {
        border: 'border-warning-border bg-warning-bg text-charcoal',
        badge: 'bg-warning text-white',
        icon: HelpCircle,
        iconColor: 'text-warning',
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
    <div id="verification-results" className="space-y-6 animate-fadeIn text-charcoal">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3.5 sm:p-4 rounded-md border border-neutral-border shadow-sm print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-muted">Investigation ID:</span>
          <span className="text-xs font-mono font-semibold text-charcoal bg-warm px-2 py-0.5 rounded border border-neutral-border">
            {report.id}
          </span>
          <button
            onClick={handleCopyReportId}
            className="text-xs text-muted hover:text-charcoal inline-flex items-center space-x-1 p-1 rounded hover:bg-warm transition"
            title="Copy Report ID"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-charcoal bg-surface hover:bg-neutral-subtle px-3 py-1.5 rounded border border-neutral-border transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-muted" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-white bg-forest hover:bg-forest-700 px-3.5 py-1.5 rounded transition shadow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Start New Verification</span>
          </button>
        </div>
      </div>

      {/* Main Overall Assessment Banner */}
      <div className={`rounded-md border p-5 sm:p-6 shadow-sm ${bannerTheme.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold ${bannerTheme.badge}`}>
              <BannerIcon className="w-3.5 h-3.5" />
              <span>{overallAssessment.badgeLabel}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(report.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-charcoal mb-2">
          {overallAssessment.headline}
        </h2>

        <p className="text-xs sm:text-sm text-charcoal/90 max-w-3xl leading-relaxed mb-5">
          {overallAssessment.summary}
        </p>

        {/* Severity Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-charcoal/10">
          <div className="bg-surface p-2.5 rounded border border-neutral-border">
            <span className="text-[11px] text-danger font-medium block">Critical Red Flags</span>
            <span className="text-xl font-bold text-danger">{metrics.criticalCount}</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-neutral-border">
            <span className="text-[11px] text-warning font-medium block">Warning Signs</span>
            <span className="text-xl font-bold text-warning">{metrics.warningCount}</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-neutral-border">
            <span className="text-[11px] text-muted font-medium block">Cautions / Missing Info</span>
            <span className="text-xl font-bold text-charcoal">{metrics.cautionCount}</span>
          </div>

          <div className="bg-surface p-2.5 rounded border border-neutral-border">
            <span className="text-[11px] text-forest font-medium block">Verified Positive Signals</span>
            <span className="text-xl font-bold text-forest">{metrics.verifiedCount}</span>
          </div>
        </div>
      </div>

      {/* Observed Facts Table */}
      <div className="bg-surface border border-neutral-border rounded-md p-5 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Building className="w-4 h-4 text-muted" />
          <h3 className="text-sm font-semibold text-charcoal">
            Observed Submission Facts (Evidence Summary)
          </h3>
        </div>
        <p className="text-xs text-muted mb-4">
          Key facts directly extracted from the submission and verified against domain syntax, email routing rules, and fee parameters:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {observedFacts.map((fact, idx) => {
            const statusConfig =
              fact.status === 'FLAGGED'
                ? { bg: 'bg-danger-bg text-danger-text border-danger-border', dot: 'bg-danger' }
                : fact.status === 'VERIFIED'
                ? { bg: 'bg-sage text-forest border-sage-border', dot: 'bg-forest' }
                : fact.status === 'MISSING'
                ? { bg: 'bg-warning-bg text-warning-text border-warning-border', dot: 'bg-warning' }
                : { bg: 'bg-warm text-charcoal border-neutral-border', dot: 'bg-muted' };

            return (
              <div
                key={idx}
                className={`p-2.5 rounded border text-xs ${statusConfig.bg}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium uppercase tracking-wider text-[10px] text-muted">
                    {fact.label}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                </div>
                <p className="font-semibold text-xs truncate" title={fact.value}>
                  {fact.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Listing Match Section */}
      {report.officialListingMatch && (
        <OfficialListingMatchCard matchResult={report.officialListingMatch} />
      )}

      {/* Individual Findings with Severity Filter */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-base font-semibold text-charcoal">
              Detailed Rule Findings ({findings.length})
            </h3>
            <p className="text-xs text-muted">
              Individual rule findings with observed evidence, contextual explanation, and recommended actions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 print:hidden text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded transition border ${
                activeFilter === 'ALL'
                  ? 'bg-charcoal text-white border-charcoal font-medium'
                  : 'bg-surface text-muted border-neutral-border hover:text-charcoal hover:bg-neutral-subtle'
              }`}
            >
              All ({findings.length})
            </button>
            {metrics.criticalCount > 0 && (
              <button
                onClick={() => setActiveFilter('CRITICAL')}
                className={`px-2 py-1 rounded transition border ${
                  activeFilter === 'CRITICAL'
                    ? 'bg-danger text-white border-danger font-medium'
                    : 'bg-danger-bg text-danger-text border-danger-border'
                }`}
              >
                Critical ({metrics.criticalCount})
              </button>
            )}
            {metrics.warningCount > 0 && (
              <button
                onClick={() => setActiveFilter('WARNING')}
                className={`px-2 py-1 rounded transition border ${
                  activeFilter === 'WARNING'
                    ? 'bg-warning text-white border-warning font-medium'
                    : 'bg-warning-bg text-warning-text border-warning-border'
                }`}
              >
                Warnings ({metrics.warningCount})
              </button>
            )}
            {metrics.cautionCount > 0 && (
              <button
                onClick={() => setActiveFilter('CAUTION')}
                className={`px-2 py-1 rounded transition border ${
                  activeFilter === 'CAUTION'
                    ? 'bg-muted-700 text-white border-muted-700 font-medium'
                    : 'bg-warm text-muted border-neutral-border'
                }`}
              >
                Cautions ({metrics.cautionCount})
              </button>
            )}
            {metrics.verifiedCount > 0 && (
              <button
                onClick={() => setActiveFilter('VERIFIED')}
                className={`px-2 py-1 rounded transition border ${
                  activeFilter === 'VERIFIED'
                    ? 'bg-forest text-white border-forest font-medium'
                    : 'bg-sage text-forest border-sage-border'
                }`}
              >
                Verified ({metrics.verifiedCount})
              </button>
            )}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
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
      <div className="text-center pt-3 pb-6 print:hidden">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-charcoal hover:bg-charcoal-900 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded transition shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-muted-300" />
          <span>Verify Another Offer</span>
        </button>
      </div>
    </div>
  );
}
