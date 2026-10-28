'use client';

import React, { useState } from 'react';
import { OfferInput, OfferSource, SampleCase } from '@/lib/types';
import { DEMO_SCENARIOS } from '@/lib/demoScenarios';
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
  Loader2,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Hash,
} from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (data: OfferInput) => void;
  isLoading: boolean;
  initialData?: OfferInput | null;
  onSelectSample?: (sample: SampleCase) => void;
}

const SOURCES: { value: OfferSource; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn (Job Board / Direct Message)' },
  { value: 'campus', label: 'College Placement Cell (TPO Drive)' },
  { value: 'internshala', label: 'Internshala Portal' },
  { value: 'telegram', label: 'Telegram (Channel / Direct Message)' },
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
      jobId: '',
      location: '',
      compensation: '',
      duration: '',
      applicationDeadline: '',
      demoScenarioId: '',
    }
  );

  const [activeDemo, setActiveDemo] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setActiveDemo(initialData.demoScenarioId || '');
      setErrors({});
    }
  }, [initialData]);

  const handleSelectScenario = (key: string) => {
    if (!key) {
      setActiveDemo('');
      setFormData((prev) => ({
        ...prev,
        demoScenarioId: '',
      }));
      return;
    }

    const demo = DEMO_SCENARIOS[key];
    if (demo) {
      setActiveDemo(key);
      setFormData({
        companyName: demo.companyName,
        companyWebsite: demo.companyWebsite,
        jobListingUrl: demo.listingUrl,
        jobTitle: demo.jobTitle,
        jobId: demo.jobId,
        location: demo.location,
        compensation: demo.compensation,
        duration: demo.duration,
        applicationDeadline: demo.applicationDeadline,
        recruiterName: demo.recruiterName,
        recruiterEmail: demo.recruiterEmail,
        offerSource: demo.offerSource,
        feeRequested: demo.feeRequested,
        feeAmount: demo.feeAmount,
        feeReason: demo.feeReason,
        pastedText: demo.pastedText,
        demoScenarioId: key,
      });
      setErrors({});
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      errs.companyName = 'Company name is required for verification.';
    }

    if (formData.feeRequested) {
      if (!formData.feeAmount && !(formData.feeReason || '').trim()) {
        errs.feeAmount = 'Please specify the fee amount or stated reason.';
      }
    }

    if (formData.recruiterEmail && !formData.recruiterEmail.includes('@')) {
      errs.recruiterEmail = 'Please provide a valid email format (e.g., name@company.com).';
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
        pastedText: prev.pastedText ? prev.pastedText : doc.extractedText,
      }));
    }
  };

  return (
    <div id="verification-form-container" className="bg-surface rounded-md border border-neutral-border shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-surface px-6 py-5 border-b border-neutral-border">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-forest mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Opportunity Details Intake</span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-charcoal">
          Offer Verification & Listing Cross-Check
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Submit the parameters of your offer. The engine evaluates recruiter domain alignment, advance-fee red flags, and discrepancies against the company's published careers listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Scenario Quick Selector */}
        <div className="bg-warm border border-neutral-border rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-charcoal">
              Test Scenarios (Demonstrations)
            </span>
            <span className="text-[11px] text-muted">
              Load an illustrative case or enter custom details.
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectScenario('')}
              className={`text-xs px-2.5 py-1 rounded transition border ${
                activeDemo === ''
                  ? 'bg-charcoal text-white border-charcoal font-medium'
                  : 'bg-surface text-muted border-neutral-border hover:text-charcoal hover:bg-neutral-subtle'
              }`}
            >
              Custom Input
            </button>

            {Object.entries(DEMO_SCENARIOS).map(([key, demo]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectScenario(key)}
                className={`text-xs px-2.5 py-1 rounded transition border ${
                  activeDemo === key
                    ? 'bg-forest text-white border-forest font-medium'
                    : 'bg-surface text-muted border-neutral-border hover:text-charcoal hover:bg-neutral-subtle'
                }`}
                title={demo.description}
              >
                {demo.badgeLabel}
              </button>
            ))}
          </div>

          {activeDemo && DEMO_SCENARIOS[activeDemo] && (
            <p className="text-[11px] text-muted bg-surface p-2 rounded border border-neutral-border mt-1">
              <strong className="text-charcoal font-medium">Loaded Scenario: </strong>
              {DEMO_SCENARIOS[activeDemo].description}
            </p>
          )}
        </div>

        {/* Section 1: Company & Role */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted pb-1 border-b border-neutral-border flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-forest" />
            <span>1. Company & Role Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Company Name <span className="text-danger-text">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Razorpay, Thoughtworks, Swiggy"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`w-full text-xs sm:text-sm px-3 py-2 rounded border ${
                  errors.companyName ? 'border-danger-border bg-danger-bg' : 'border-neutral-border focus:border-forest'
                } outline-none text-charcoal placeholder:text-muted/60 transition`}
              />
              {errors.companyName && (
                <p className="text-xs text-danger-text mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Company Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://company.com"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 transition"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Job or Internship Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering Intern"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 transition"
                />
              </div>
            </div>

            {/* Requisition ID */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Requisition / Job ID (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. RZP-ENG-2025-042"
                  value={formData.jobId || ''}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Recruiter & Source */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted pb-1 border-b border-neutral-border flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-forest" />
            <span>2. Recruiter Identity & Communication Channel</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Recruiter Name */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Recruiter Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Priya Nair (Campus Team)"
                  value={formData.recruiterName}
                  onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                  className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 transition"
                />
              </div>
            </div>

            {/* Recruiter Email */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Recruiter Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. priya.nair@company.com"
                  value={formData.recruiterEmail}
                  onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                  className={`w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border ${
                    errors.recruiterEmail ? 'border-danger-border bg-danger-bg' : 'border-neutral-border focus:border-forest'
                  } outline-none text-charcoal placeholder:text-muted/60 transition`}
                />
              </div>
              {errors.recruiterEmail && (
                <p className="text-xs text-danger-text mt-1">{errors.recruiterEmail}</p>
              )}
            </div>

            {/* Offer Source */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Recruitment Channel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <select
                  value={formData.offerSource}
                  onChange={(e) => setFormData({ ...formData, offerSource: e.target.value as OfferSource })}
                  className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal bg-surface transition"
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

        {/* Section 3: Official Listing Cross-Check */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center space-x-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-forest" />
              <span>3. Official Listing Match (Cross-Check)</span>
            </h3>
            <span className="text-[11px] font-medium text-forest bg-sage px-2 py-0.5 rounded border border-sage-border">
              Supported Sources Check
            </span>
          </div>

          <p className="text-xs text-muted">
            Provide the company's published listing URL to compare role ID, stipend, and fee requirements.
          </p>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1">
              Official Listing URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="e.g. https://company.com/careers/jobs/123 or Greenhouse / Lever link"
                value={formData.jobListingUrl}
                onChange={(e) => setFormData({ ...formData, jobListingUrl: e.target.value, demoScenarioId: '' })}
                className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 transition"
              />
            </div>
          </div>

          {/* Opportunity Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-muted mb-1">
                Location / Work Mode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <MapPin className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Bangalore (Hybrid)"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted mb-1">
                Stipend / Compensation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <IndianRupee className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. \u20B935,000 / month"
                  value={formData.compensation || ''}
                  onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                  className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted mb-1">
                Duration
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Clock className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 6 Months"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted mb-1">
                Application Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted">
                  <Calendar className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 15 Nov 2025"
                  value={formData.applicationDeadline || ''}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full text-xs pl-7 pr-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Monetary Check */}
        <div className="bg-warm border border-neutral-border rounded p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-danger-text shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-charcoal">
                Payment, Registration, or Deposit Mandate
              </h4>
              <p className="text-[11px] text-muted">
                Under Indian labour standards and AICTE guidelines, legitimate employers never charge candidate fees.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-surface p-2.5 rounded border border-neutral-border">
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
              className="w-4 h-4 text-forest rounded border-neutral-border focus:ring-forest cursor-pointer"
            />
            <label htmlFor="feeRequestedToggle" className="text-xs font-medium text-charcoal cursor-pointer">
              Did the recruiter or offer letter request any money, security deposit, or fee?
            </label>
          </div>

          {formData.feeRequested && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-charcoal mb-1">
                  Requested Amount (INR &#8377;)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-medium text-muted">
                    &#8377;
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
                    className="w-full text-xs pl-6 pr-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-charcoal mb-1">
                  Stated Reason for Fee
                </label>
                <input
                  type="text"
                  placeholder="e.g. Laptop courier, Registration, Training materials"
                  value={formData.feeReason}
                  onChange={(e) => setFormData({ ...formData, feeReason: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-neutral-border focus:border-forest outline-none text-charcoal"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Document Upload & Offer Text */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted pb-1 border-b border-neutral-border flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-forest" />
            <span>4. Offer Documentation & Text Analysis</span>
          </h3>

          <DocumentUpload
            onDocumentProcessed={handleDocumentProcessed}
            onTextAppendedToForm={(text) => {
              if (!formData.pastedText) {
                setFormData((prev) => ({ ...prev, pastedText: text }));
              }
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-charcoal">
                Offer Letter Text or Email Body (Optional)
              </label>
              <span className="text-[11px] text-muted">
                {formData.pastedText ? `${formData.pastedText.length} characters` : 'Optional'}
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Paste the offer email text or letter body. The engine scans for fine-print clauses, pressure deadlines ('pay within 4 hours'), and legal intimidation."
              value={formData.pastedText}
              onChange={(e) => setFormData({ ...formData, pastedText: e.target.value })}
              className="w-full text-xs p-3 rounded border border-neutral-border focus:border-forest outline-none text-charcoal placeholder:text-muted/60 font-mono transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-forest hover:bg-forest-700 text-white font-medium text-sm py-2.5 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Evidence & Listing Consistency...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Verification Report</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-muted mt-2">
            Deterministic serverless analysis. Files parsed in browser memory; zero document storage.
          </p>
        </div>
      </form>
    </div>
  );
}
