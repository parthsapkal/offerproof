'use client';

import React, { useState } from 'react';
import { OfficialListingMatchResult } from '@/lib/types';
import {
  CheckCircle2,
  AlertOctagon,
  AlertCircle,
  Info,
  ExternalLink,
  ShieldCheck,
  Building,
  FileCheck,
  UserCheck,
  ArrowRightCircle,
  Lock,
} from 'lucide-react';

interface OfficialListingMatchCardProps {
  matchResult: OfficialListingMatchResult;
}

export function OfficialListingMatchCard({ matchResult }: OfficialListingMatchCardProps) {
  const [filterMode, setFilterMode] = useState<'ALL' | 'MISMATCH' | 'MATCH'>('ALL');

  const {
    status,
    statusLabel,
    summary,
    listingUrl,
    sourceDomain,
    isIndependentlyVerifiedSource,
    checkedAt,
    fields,
    matchedCount,
    mismatchedCount,
    unavailableCount,
    suspiciousDifferences,
    recommendedNextSteps,
    threePillarVerification,
    isSimulatedDemo,
    simulatedScenarioTitle,
  } = matchResult;

  const isStrongMatch = status === 'STRONG_MATCH';
  const isMismatch = status === 'MISMATCH_DETECTED';
  const isUnableToVerify = status === 'UNABLE_TO_VERIFY';

  const statusConfig = isStrongMatch
    ? {
        border: 'border-sage-border',
        badge: 'bg-forest text-white font-medium',
        icon: CheckCircle2,
        bannerBg: 'bg-sage-light text-charcoal',
      }
    : isMismatch
    ? {
        border: 'border-danger-border',
        badge: 'bg-danger text-white font-medium',
        icon: AlertOctagon,
        bannerBg: 'bg-danger-bg text-charcoal',
      }
    : isUnableToVerify
    ? {
        border: 'border-warning-border',
        badge: 'bg-warning text-white font-medium',
        icon: AlertCircle,
        bannerBg: 'bg-warning-bg text-charcoal',
      }
    : {
        border: 'border-neutral-border',
        badge: 'bg-muted-700 text-white font-medium',
        icon: Info,
        bannerBg: 'bg-warm text-charcoal',
      };

  const StatusIcon = statusConfig.icon;

  const filteredFields = fields.filter((f) => {
    if (filterMode === 'MATCH') return f.status === 'MATCH';
    if (filterMode === 'MISMATCH') return f.status === 'MISMATCH';
    return true;
  });

  return (
    <div className="bg-surface rounded-md border border-neutral-border shadow-sm overflow-hidden space-y-5 text-charcoal">
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 border-b border-neutral-border ${statusConfig.bannerBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Official Opportunity Cross-Verification</span>
            </span>
            {isSimulatedDemo && (
              <span className="text-[10px] font-medium uppercase tracking-wider bg-surface text-charcoal px-2 py-0.5 rounded border border-neutral-border">
                Demonstration Scenario
              </span>
            )}
          </div>
          <span className="text-xs text-muted">
            Checked {new Date(checkedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded text-xs uppercase tracking-wider flex items-center space-x-1 ${statusConfig.badge}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{statusLabel}</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-charcoal">
              Official Listing Match Assessment
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/80 max-w-2xl mt-1 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Quick Metrics */}
          {fields.length > 0 && (
            <div className="flex items-center space-x-1.5 text-xs bg-surface p-2 rounded border border-neutral-border shrink-0">
              <span className="px-2 py-0.5 rounded bg-sage text-forest font-medium border border-sage-border">
                {matchedCount} Matched
              </span>
              <span className={`px-2 py-0.5 rounded font-medium border ${
                mismatchedCount > 0 ? 'bg-danger-bg text-danger-text border-danger-border' : 'bg-warm text-muted border-neutral-border'
              }`}>
                {mismatchedCount} Mismatched
              </span>
              <span className="px-2 py-0.5 rounded bg-warm text-muted border border-neutral-border">
                {unavailableCount} N/A
              </span>
            </div>
          )}
        </div>

        {/* Source Authenticity Info */}
        <div className="mt-4 pt-3 border-t border-neutral-border flex flex-wrap items-center justify-between text-xs text-muted gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-charcoal">Listing Source:</span>
            <span className="font-mono text-charcoal">{sourceDomain || 'None'}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
              isIndependentlyVerifiedSource
                ? 'bg-sage text-forest border-sage-border'
                : 'bg-warning-bg text-warning-text border-warning-border'
            }`}>
              {isIndependentlyVerifiedSource ? 'Independently Verified Domain' : 'Unverified / Third-Party Source'}
            </span>
          </div>

          {listingUrl && (
            <a
              href={listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-forest hover:text-forest-700 underline underline-offset-2"
            >
              <span>View Listing Source URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* THREE DISTINCT VERIFICATION PILLARS */}
        <div>
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-charcoal flex items-center space-x-2">
              <Lock className="w-4 h-4 text-forest" />
              <span>Independent Recruiter Verification (Three Separate Questions)</span>
            </h4>
            <p className="text-xs text-muted mt-0.5">
              A genuine listing does NOT prove the recruiter is real. Fraudulent operators frequently copy legitimate job descriptions. Evaluate these 3 questions independently:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Pillar 1: Company Legitimacy */}
            <div className="p-3.5 rounded border border-neutral-border bg-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted flex items-center space-x-1">
                    <Building className="w-3 h-3 text-muted" />
                    <span>1. Company Legitimacy</span>
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    threePillarVerification.companyLegitimacy.status === 'VERIFIED'
                      ? 'bg-sage text-forest border-sage-border'
                      : 'bg-warning-bg text-warning-text border-warning-border'
                  }`}>
                    {threePillarVerification.companyLegitimacy.label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-charcoal mb-1">
                  Does the company exist?
                </p>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {threePillarVerification.companyLegitimacy.summary}
                </p>
              </div>
              <div className="text-[11px] text-muted border-t border-neutral-border pt-2">
                <strong className="text-charcoal font-medium">Next: </strong>
                {threePillarVerification.companyLegitimacy.actionRequired}
              </div>
            </div>

            {/* Pillar 2: Official Listing Match */}
            <div className="p-3.5 rounded border border-neutral-border bg-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted flex items-center space-x-1">
                    <FileCheck className="w-3 h-3 text-muted" />
                    <span>2. Listing Consistency</span>
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    threePillarVerification.listingMatch.status === 'VERIFIED'
                      ? 'bg-sage text-forest border-sage-border'
                      : threePillarVerification.listingMatch.status === 'MISMATCH'
                      ? 'bg-danger-bg text-danger-text border-danger-border'
                      : 'bg-warning-bg text-warning-text border-warning-border'
                  }`}>
                    {threePillarVerification.listingMatch.label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-charcoal mb-1">
                  Does the role match an official opening?
                </p>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {threePillarVerification.listingMatch.summary}
                </p>
              </div>
              <div className="text-[11px] text-muted border-t border-neutral-border pt-2">
                <strong className="text-charcoal font-medium">Next: </strong>
                {threePillarVerification.listingMatch.actionRequired}
              </div>
            </div>

            {/* Pillar 3: Recruiter Authority */}
            <div className={`p-3.5 rounded border flex flex-col justify-between ${
              threePillarVerification.recruiterAuthorization.status === 'SUSPICIOUS'
                ? 'bg-danger-bg/50 border-danger-border'
                : threePillarVerification.recruiterAuthorization.status === 'CONFIRMED'
                ? 'bg-sage-light border-sage-border'
                : 'bg-warning-bg/50 border-warning-border'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-muted" />
                    <span>3. Recruiter Authority</span>
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    threePillarVerification.recruiterAuthorization.status === 'CONFIRMED'
                      ? 'bg-forest text-white border-forest'
                      : threePillarVerification.recruiterAuthorization.status === 'SUSPICIOUS'
                      ? 'bg-danger text-white border-danger'
                      : 'bg-warning text-white border-warning'
                  }`}>
                    {threePillarVerification.recruiterAuthorization.label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-charcoal mb-1">
                  Is this recruiter authorized?
                </p>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {threePillarVerification.recruiterAuthorization.summary}
                </p>
              </div>
              <div className="text-[11px] text-muted border-t border-neutral-border pt-2">
                <strong className="text-charcoal font-medium">Action: </strong>
                {threePillarVerification.recruiterAuthorization.actionRequired}
              </div>
            </div>
          </div>

          {/* Safety Rule Note */}
          <div className="mt-3 p-3 rounded bg-warm border border-neutral-border text-xs text-charcoal flex items-start space-x-2">
            <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-charcoal">Student Safety Guidance: </span>
              <span className="text-muted">{threePillarVerification.guidanceNote}</span>
            </div>
          </div>
        </div>

        {/* Suspicious Differences Warning Callout */}
        {suspiciousDifferences.length > 0 && (
          <div className="p-4 rounded bg-danger-bg border border-danger-border text-charcoal space-y-1.5">
            <div className="flex items-center space-x-2 font-semibold text-xs uppercase tracking-wider text-danger-text">
              <AlertOctagon className="w-4 h-4 text-danger-text" />
              <span>Critical Discrepancies Detected Against Public Requisition</span>
            </div>
            <ul className="space-y-1 text-xs text-charcoal/90 pl-5 list-disc font-medium">
              {suspiciousDifferences.map((diff, idx) => (
                <li key={idx}>{diff}</li>
              ))}
            </ul>
          </div>
        )}

        {/* FIELD-BY-FIELD COMPARISON TABLE */}
        {fields.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-charcoal">
                  Field-by-Field Comparison Matrix ({fields.length} Fields Checked)
                </h4>
                <p className="text-xs text-muted">
                  Compares values extracted from the submitted offer against the public requisition.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex space-x-1 bg-warm p-1 rounded border border-neutral-border text-xs">
                <button
                  onClick={() => setFilterMode('ALL')}
                  className={`px-2 py-0.5 rounded transition ${filterMode === 'ALL' ? 'bg-surface shadow-sm text-charcoal font-medium' : 'text-muted'}`}
                >
                  All ({fields.length})
                </button>
                <button
                  onClick={() => setFilterMode('MISMATCH')}
                  className={`px-2 py-0.5 rounded transition ${filterMode === 'MISMATCH' ? 'bg-danger text-white font-medium' : 'text-danger-text'}`}
                >
                  Mismatches ({mismatchedCount})
                </button>
                <button
                  onClick={() => setFilterMode('MATCH')}
                  className={`px-2 py-0.5 rounded transition ${filterMode === 'MATCH' ? 'bg-forest text-white font-medium' : 'text-forest'}`}
                >
                  Matches ({matchedCount})
                </button>
              </div>
            </div>

            <div className="border border-neutral-border rounded overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm text-muted uppercase text-[10px] tracking-wider font-semibold border-b border-neutral-border">
                  <tr>
                    <th className="py-2.5 px-3">Opportunity Field</th>
                    <th className="py-2.5 px-3">Submitted Offer Value</th>
                    <th className="py-2.5 px-3">Official Listing Value</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Evidence & Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border bg-surface">
                  {filteredFields.map((field) => {
                    const isFieldMatch = field.status === 'MATCH';
                    const isFieldMismatch = field.status === 'MISMATCH';

                    return (
                      <tr
                        key={field.fieldName}
                        className={`transition hover:bg-neutral-subtle ${
                          field.isSecurityCritical && isFieldMismatch ? 'bg-danger-bg/40 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium text-charcoal whitespace-nowrap">
                          {field.fieldLabel}
                        </td>
                        <td className="py-2.5 px-3 text-charcoal font-mono text-[11px] max-w-xs break-words">
                          {field.submittedValue || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-charcoal font-mono text-[11px] max-w-xs break-words">
                          {field.listingValue || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                            isFieldMatch
                              ? 'bg-sage text-forest border-sage-border'
                              : isFieldMismatch
                              ? 'bg-danger-bg text-danger-text border-danger-border'
                              : 'bg-warm text-muted border-neutral-border'
                          }`}>
                            {isFieldMatch ? (
                              <span>Match</span>
                            ) : isFieldMismatch ? (
                              <span>Mismatch</span>
                            ) : (
                              <span>Not Available</span>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted text-xs">
                          {field.explanation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommended Actions for Listing Result */}
        <div className="bg-warm rounded p-4 border border-neutral-border">
          <h5 className="font-semibold text-charcoal text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ArrowRightCircle className="w-3.5 h-3.5 text-forest" />
            <span>Recommended Steps Based on Listing Evidence:</span>
          </h5>
          <ul className="space-y-1 text-xs text-muted">
            {recommendedNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                <span className="text-charcoal/90">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
