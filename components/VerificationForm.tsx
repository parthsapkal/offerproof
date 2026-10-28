'use client';

import React, { useState } from 'react';
import { OfferInput, OfferSource, SampleCase } from '@/lib/types';
import { DocumentUpload } from './DocumentUpload';
import {
  Building2,
  Globe,
  User,
  Mail,
  Briefcase,
  Link as LinkIcon,
  MessageSquare,
  IndianRupee,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (data: OfferInput) => void;
  isLoading: boolean;
  initialData?: OfferInput | null;
  onSelectSample?: (sample: SampleCase) => void;
}

const SOURCES: { value: OfferSource; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn (Job Board / Recruiter DM)' },
  { value: 'campus', label: 'College Placement Cell (TPO Drive)' },
  { value: 'internshala', label: 'Internshala Portal' },
  { value: 'telegram', label: 'Telegram (Group / Channel / DM)' },
  { value: 'whatsapp', label: 'WhatsApp (Direct Message)' },
  { value: 'cold_email', label: 'Cold / Unsolicited Email' },
  { value: 'job_portal', label: 'Job Portal (Naukri / Indeed / Unstop)' },
  { value: 'social_media', label: 'Social Media Ad (Instagram / Facebook)' },
  { value: 'other', label: 'Other / Offline Source' },
];

export function VerificationForm({ onSubmit, isLoading, initialData }: VerificationFormProps) {
  const [formData, setFormData] = useState<OfferInput>(
    initialData || {
      companyName: '',
      companyWebsite: '',
      recruiterName: '',
      recruiterEmail: '',
      jobTitle: '',
      jobListingUrl: '',
      offerSource: 'linkedin',
      feeRequested: false,
      feeAmount: null,
      feeReason: '',
      pastedText: '',
      documentFileName: '',
      documentFileType: '',
      documentExtractedText: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with initialData changes (e.g. when sample case is loaded)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [initialData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      errs.companyName = 'Company name is required for verification.';
    }

    if (formData.feeRequested) {
      if (!formData.feeAmount && !(formData.feeReason || '').trim()) {
        errs.feeAmount = 'Please specify the fee amount or reason requested.';
      }
    }

    if (formData.recruiterEmail && !formData.recruiterEmail.includes('@')) {
      errs.recruiterEmail = 'Please provide a valid email format (e.g., recruiter@company.com).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleDocumentProcessed = (doc: {
    fileName: string;
    fileType: string;
    extractedText: string;
    fileSize: number;
  } | null) => {
    if (!doc) {
      setFormData((prev) => ({
        ...prev,
        documentFileName: '',
        documentFileType: '',
        documentExtractedText: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        documentFileName: doc.fileName,
        documentFileType: doc.fileType,
        documentExtractedText: doc.extractedText,
        // If pastedText is empty and PDF has text, optionally auto-fill
        pastedText: prev.pastedText ? prev.pastedText : doc.extractedText,
      }));
    }
  };

  return (
    <div id="verification-form-container" className="bg-white rounded-2xl border border-navy-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 px-6 sm:px-8 py-6 text-white border-b border-navy-800">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Independent Assessment Intake</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Internship Offer Verification Form
        </h2>
        <p className="text-navy-300 text-xs sm:text-sm mt-1">
          Fill in the details from your internship correspondence. Our serverless engine executes deterministic rules against fee demands, lookalike domains, and recruitment patterns.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Section 1: Core Company & Role Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-800 pb-1 border-b border-navy-100 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>1. Company & Role Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Claimed Company Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Razorpay, Swiggy, TCS, Apex Solutions"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                    errors.companyName ? 'border-red-500 bg-red-50/20' : 'border-navy-300 focus:border-teal-500'
                  } focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400`}
                />
              </div>
              {errors.companyName && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.companyName}</p>
              )}
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Company Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://razorpay.com"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Job Title / Internship Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering Intern, Growth Operations"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400"
                />
              </div>
            </div>

            {/* Job Listing URL */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Job Listing or Career Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://linkedin.com/jobs/view/... or careers page"
                  value={formData.jobListingUrl}
                  onChange={(e) => setFormData({ ...formData, jobListingUrl: e.target.value })}
                  className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Recruiter & Source Authentication */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-800 pb-1 border-b border-navy-100 flex items-center space-x-1.5">
            <User className="w-4 h-4 text-teal-600" />
            <span>2. Recruiter Identity & Channel</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Recruiter Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Recruiter / Contact Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Priya Nair (HR)"
                  value={formData.recruiterName}
                  onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                  className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400"
                />
              </div>
            </div>

            {/* Recruiter Email */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Recruiter Contact Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. priya.nair@company.com"
                  value={formData.recruiterEmail}
                  onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                  className={`w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border ${
                    errors.recruiterEmail ? 'border-red-500 bg-red-50/20' : 'border-navy-300 focus:border-teal-500'
                  } focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400`}
                />
              </div>
              {errors.recruiterEmail && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.recruiterEmail}</p>
              )}
            </div>

            {/* Offer Source */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Offer Communication Channel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <select
                  value={formData.offerSource}
                  onChange={(e) => setFormData({ ...formData, offerSource: e.target.value as OfferSource })}
                  className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 bg-white"
                >
                  {SOURCES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Monetary / Fee Check (Highest Priority Warning) */}
        <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-950 uppercase tracking-wider">
                  Payment or Deposit Demands
                </h3>
                <p className="text-xs text-red-800">
                  Legitimate internships NEVER require student applicants to pay any fee.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-red-200">
            <input
              type="checkbox"
              id="feeRequestedToggle"
              checked={formData.feeRequested}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  feeRequested: e.target.checked,
                  feeAmount: e.target.checked ? formData.feeAmount || 2500 : null,
                  feeReason: e.target.checked ? formData.feeReason || 'Registration / Onboarding Kit' : '',
                })
              }
              className="w-4 h-4 text-red-600 rounded border-navy-300 focus:ring-red-500"
            />
            <label htmlFor="feeRequestedToggle" className="text-xs sm:text-sm font-bold text-red-950 cursor-pointer">
              Did the recruiter or offer letter request ANY money, deposit, or fee?
            </label>
          </div>

          {formData.feeRequested && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1">
                  Requested Amount (in \u20B9 INR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-navy-600">
                    \u20B9
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2500"
                    value={formData.feeAmount || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        feeAmount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-red-300 focus:border-red-500 outline-none text-navy-950 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1">
                  Stated Fee Reason / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Registration fee, Laptop courier, Training kit deposit"
                  value={formData.feeReason}
                  onChange={(e) => setFormData({ ...formData, feeReason: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-red-300 focus:border-red-500 outline-none text-navy-950"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Document Upload & Pasted Offer Text */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-800 pb-1 border-b border-navy-100 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>4. Offer Documentation & Text Analysis</span>
          </h3>

          {/* Document Upload */}
          <DocumentUpload
            onDocumentProcessed={handleDocumentProcessed}
            onTextAppendedToForm={(text) => {
              if (!formData.pastedText) {
                setFormData((prev) => ({ ...prev, pastedText: text }));
              }
            }}
          />

          {/* Pasted Text Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Pasted Offer Email Body or Letter Text (Optional)
              </label>
              <span className="text-[11px] text-navy-500">
                {formData.pastedText ? `${formData.pastedText.length} characters` : 'Optional'}
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Paste the message, email text, or offer letter contents here. The engine scans for artificial deadlines ('pay within 4 hours'), typing job traps, and legal intimidation threats."
              value={formData.pastedText}
              onChange={(e) => setFormData({ ...formData, pastedText: e.target.value })}
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-navy-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-navy-900 placeholder:text-navy-400 font-mono"
            />
          </div>
        </div>

        {/* Submit Button & Loading State */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-navy-950 font-extrabold text-base sm:text-lg py-4 px-6 rounded-xl shadow-lg shadow-teal-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Evaluating Evidence Across 6 Verification Modules...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                <span>Run OfferProof Verification Engine</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-navy-500 mt-2">
            Deterministic serverless analysis. Never displays simulated results without actual processing.
          </p>
        </div>
      </form>
    </div>
  );
}
