'use client';

import React, { useState } from 'react';
import { OfficialListingMatchResult } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  AlertCircle,
  Info,
  ExternalLink,
  ShieldCheck,
  Building,
  FileCheck,
  UserCheck,
  ArrowRightCircle,
  Sparkles,
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
    sourceType,
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
  const isUnverifiedDomain = status === 'USER_PROVIDED_UNVERIFIED';

  const statusConfig = isStrongMatch
    ? {
        border: 'border-teal-400 bg-teal-500/10 text-teal-300',
        badge: 'bg-teal-500 text-navy-950 font-black',
        icon: CheckCircle2,
        bannerBg: 'bg-gradient-to-r from-teal-950 via-teal-900 to-navy-950',
      }
    : isMismatch
    ? {
        border: 'border-red-500 bg-red-500/10 text-red-300',
        badge: 'bg-red-600 text-white font-black',
        icon: AlertOctagon,
        bannerBg: 'bg-gradient-to-r from-red-950 via-red-900 to-navy-950',
      }
    : isUnverifiedDomain
    ? {
        border: 'border-blue-400 bg-blue-500/10 text-blue-300',
        badge: 'bg-blue-600 text-white font-bold',
        icon: Info,
        bannerBg: 'bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950',
      }
    : isUnableToVerify
    ? {
        border: 'border-amber-400 bg-amber-500/10 text-amber-300',
        badge: 'bg-amber-600 text-white font-bold',
        icon: AlertCircle,
        bannerBg: 'bg-gradient-to-r from-amber-950 via-amber-900 to-navy-950',
      }
    : {
        border: 'border-amber-400 bg-amber-500/10 text-amber-300',
        badge: 'bg-amber-600 text-white font-bold',
        icon: AlertTriangle,
        bannerBg: 'bg-gradient-to-r from-navy-950 via-amber-950/40 to-navy-950',
      };

  const StatusIcon = statusConfig.icon;

  const filteredFields = fields.filter((f) => {
    if (filterMode === 'MATCH') return f.status === 'MATCH';
    if (filterMode === 'MISMATCH') return f.status === 'MISMATCH';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-navy-200 shadow-md overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-7 text-white ${statusConfig.bannerBg} border-b border-navy-800`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Opportunity Cross-Verification</span>
            </span>
            {isSimulatedDemo && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-navy-950 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Benchmark Demo Scenario</span>
              </span>
            )}
          </div>
          <span className="text-xs text-navy-300">
            Checked: {new Date(checkedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center space-x-1.5 ${statusConfig.badge}`}>
                <StatusIcon className="w-4 h-4" />
                <span>{statusLabel}</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Official Listing Match Assessment
            </h3>
            <p className="text-sm text-navy-200 max-w-2xl mt-1 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Quick Metrics */}
          {fields.length > 0 && (
            <div className="flex items-center space-x-2 text-xs bg-black/30 p-2.5 rounded-xl border border-white/10 shrink-0">
              <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                {matchedCount} Matched
              </span>
              <span className={`px-2 py-1 rounded font-bold border ${
                mismatchedCount > 0 ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-navy-800 text-navy-400 border-navy-700'
              }`}>
                {mismatchedCount} Mismatched
              </span>
              <span className="px-2 py-1 rounded bg-navy-800 text-navy-300 border border-navy-700">
                {unavailableCount} N/A
              </span>
            </div>
          )}
        </div>

        {/* Source Authenticity Info */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-navy-300 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">Listing Source:</span>
            <span className="font-mono text-teal-300">{sourceDomain || 'None'}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isIndependentlyVerifiedSource
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isIndependentlyVerifiedSource ? 'Independently Verified Domain' : 'Unverified / Third-Party Source'}
            </span>
          </div>

          {listingUrl && (
            <a
              href={listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-teal-400 hover:text-teal-300 underline underline-offset-2"
            >
              <span>View Submitted Listing URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-7">
        {/* ======================================================== */}
        {/* THREE DISTINCT VERIFICATION PILLARS                     */}
        {/* ======================================================== */}
        <div>
          <div className="mb-3">
            <h4 className="text-base font-bold text-navy-950 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Independent Recruiter Verification (Three Separate Pillars)</span>
            </h4>
            <p className="text-xs text-navy-600 mt-0.5">
              A genuine listing does NOT prove the recruiter is real. Fraudsters regularly copy real job descriptions to extort students. These 3 questions must be evaluated independently:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Company Legitimacy */}
            <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>1. Company Legitimacy</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    threePillarVerification.companyLegitimacy.status === 'VERIFIED'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {threePillarVerification.companyLegitimacy.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">
                  Does the company exist?
                </p>
                <p className="text-xs text-navy-700 leading-relaxed mb-3">
                  {threePillarVerification.companyLegitimacy.summary}
                </p>
              </div>
              <div className="text-[11px] text-navy-600 border-t border-navy-200/80 pt-2">
                <strong>Next: </strong>{threePillarVerification.companyLegitimacy.actionRequired}
              </div>
            </div>

            {/* Pillar 2: Official Listing Match */}
            <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>2. Listing Consistency</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    threePillarVerification.listingMatch.status === 'VERIFIED'
                      ? 'bg-teal-100 text-teal-800'
                      : threePillarVerification.listingMatch.status === 'MISMATCH'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {threePillarVerification.listingMatch.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">
                  Does the role match an official opening?
                </p>
                <p className="text-xs text-navy-700 leading-relaxed mb-3">
                  {threePillarVerification.listingMatch.summary}
                </p>
              </div>
              <div className="text-[11px] text-navy-600 border-t border-navy-200/80 pt-2">
                <strong>Next: </strong>{threePillarVerification.listingMatch.actionRequired}
              </div>
            </div>

            {/* Pillar 3: Recruiter Authority */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              threePillarVerification.recruiterAuthorization.status === 'SUSPICIOUS'
                ? 'bg-red-50/60 border-red-300'
                : threePillarVerification.recruiterAuthorization.status === 'CONFIRMED'
                ? 'bg-teal-50/60 border-teal-300'
                : 'bg-amber-50/60 border-amber-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>3. Recruiter Authority</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    threePillarVerification.recruiterAuthorization.status === 'CONFIRMED'
                      ? 'bg-teal-600 text-white'
                      : threePillarVerification.recruiterAuthorization.status === 'SUSPICIOUS'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {threePillarVerification.recruiterAuthorization.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">
                  Is this recruiter authorized?
                </p>
                <p className="text-xs text-navy-700 leading-relaxed mb-3">
                  {threePillarVerification.recruiterAuthorization.summary}
                </p>
              </div>
              <div className="text-[11px] text-navy-800 border-t border-navy-300/60 pt-2">
                <strong>Action: </strong>{threePillarVerification.recruiterAuthorization.actionRequired}
              </div>
            </div>
          </div>

          {/* Safety Rule Note */}
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Student Safety Principle: </span>
              <span>{threePillarVerification.guidanceNote}</span>
            </div>
          </div>
        </div>

        {/* Suspicious Differences Warning Callout */}
        {suspiciousDifferences.length > 0 && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-950 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-red-800">
              <AlertOctagon className="w-5 h-5 text-red-600" />
              <span>Critical Discrepancies Detected Against Public Requisition</span>
            </div>
            <ul className="space-y-1.5 text-xs text-red-900 pl-6 list-disc font-medium">
              {suspiciousDifferences.map((diff, idx) => (
                <li key={idx}>{diff}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ======================================================== */}
        {/* FIELD-BY-FIELD COMPARISON TABLE                          */}
        {/* ======================================================== */}
        {fields.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-navy-950">
                  Field-by-Field Discrepancy Matrix ({fields.length} Fields Analyzed)
                </h4>
                <p className="text-xs text-navy-600">
                  Compares values extracted from the submitted offer against the public requisition.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex space-x-1 bg-navy-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setFilterMode('ALL')}
                  className={`px-2.5 py-1 rounded transition ${filterMode === 'ALL' ? 'bg-white shadow text-navy-950 font-bold' : 'text-navy-600'}`}
                >
                  All ({fields.length})
                </button>
                <button
                  onClick={() => setFilterMode('MISMATCH')}
                  className={`px-2.5 py-1 rounded transition ${filterMode === 'MISMATCH' ? 'bg-red-600 text-white font-bold' : 'text-red-700'}`}
                >
                  Mismatches ({mismatchedCount})
                </button>
                <button
                  onClick={() => setFilterMode('MATCH')}
                  className={`px-2.5 py-1 rounded transition ${filterMode === 'MATCH' ? 'bg-teal-600 text-white font-bold' : 'text-teal-700'}`}
                >
                  Matches ({matchedCount})
                </button>
              </div>
            </div>

            <div className="border border-navy-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-3.5">Opportunity Field</th>
                    <th className="py-3 px-3.5">Submitted Offer Value</th>
                    <th className="py-3 px-3.5">Official Listing Value</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5">Evidence & Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 bg-white">
                  {filteredFields.map((field) => {
                    const isFieldMatch = field.status === 'MATCH';
                    const isFieldMismatch = field.status === 'MISMATCH';

                    return (
                      <tr
                        key={field.fieldName}
                        className={`transition hover:bg-navy-50/60 ${
                          field.isSecurityCritical && isFieldMismatch ? 'bg-red-50/70 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3.5 font-bold text-navy-950 whitespace-nowrap">
                          {field.fieldLabel}
                        </td>
                        <td className="py-3 px-3.5 text-navy-800 font-mono text-[11px] max-w-xs break-words">
                          {field.submittedValue || '—'}
                        </td>
                        <td className="py-3 px-3.5 text-navy-800 font-mono text-[11px] max-w-xs break-words">
                          {field.listingValue || '—'}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isFieldMatch
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : isFieldMismatch
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-navy-100 text-navy-600'
                          }`}>
                            {isFieldMatch ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                                <span>Match</span>
                              </>
                            ) : isFieldMismatch ? (
                              <>
                                <AlertOctagon className="w-3 h-3 text-red-600" />
                                <span>Mismatch</span>
                              </>
                            ) : (
                              <span>Not Available</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-navy-700 text-xs">
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
        <div className="bg-navy-50 rounded-xl p-4 sm:p-5 border border-navy-200">
          <h5 className="font-bold text-navy-950 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ArrowRightCircle className="w-4 h-4 text-teal-600" />
            <span>Recommended Next Steps Based on Listing Evidence:</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-navy-800">
            {recommendedNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
