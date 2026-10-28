'use client';

import React from 'react';
import { X, ShieldAlert, PhoneCall, BookOpen, ExternalLink } from 'lucide-react';

interface IndiaScamGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndiaScamGuideModal({ isOpen, onClose }: IndiaScamGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-3xl rounded-xl shadow-md border border-neutral-border overflow-hidden my-8">
        {/* Header */}
        <div className="bg-surface px-6 py-4 border-b border-neutral-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-sage text-forest flex items-center justify-center border border-sage-border">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-charcoal">
                Student Safety Guide: Indian Internship Scams
              </h3>
              <p className="text-xs text-muted">
                AICTE warnings, red flags, and verification guidance for Indian college students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted hover:text-charcoal p-1.5 rounded-md hover:bg-neutral-hover transition"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-charcoal text-sm">
          {/* Key Rule: Zero Fee Rule */}
          <div className="bg-danger-bg border border-danger-border rounded-lg p-4 text-charcoal">
            <div className="flex items-center space-x-2 mb-1.5 font-bold text-danger uppercase tracking-wider text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>The Cardinal Rule of Indian Internships</span>
            </div>
            <p className="text-sm font-semibold text-charcoal">
              Legitimate employers in India NEVER ask candidates to pay any money.
            </p>
            <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">
              Whether called an "application fee", "refundable laptop deposit", "document verification charge", or "training kit cost", any request for money before or during an internship is fraudulent.
            </p>
          </div>

          {/* Top 5 Common Scams in India */}
          <div className="space-y-3.5">
            <h4 className="font-semibold text-charcoal text-xs uppercase tracking-wider border-b border-neutral-border pb-1.5">
              Top 5 Scam Archetypes Targeting Indian Students
            </h4>

            {/* Scam 1 */}
            <div className="border border-neutral-border rounded-lg p-4 bg-warm">
              <span className="text-[11px] font-semibold text-danger uppercase tracking-wider block mb-1">Scam Type #1</span>
              <h5 className="font-semibold text-charcoal mb-1 text-sm">
                The "Upfront Registration & Laptop Courier" Trap
              </h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Fraudsters send a polished offer letter with a high stipend (e.g. ₹30,000/mo) and claim a company laptop is being dispatched. They demand ₹2,000–₹5,000 as a "courier clearance" or "asset security deposit", promising reimbursement on joining day. Once paid via UPI, the recruiter vanishes.
              </p>
            </div>

            {/* Scam 2 */}
            <div className="border border-neutral-border rounded-lg p-4 bg-warm">
              <span className="text-[11px] font-semibold text-warning uppercase tracking-wider block mb-1">Scam Type #2</span>
              <h5 className="font-semibold text-charcoal mb-1 text-sm">
                The Telegram "Prepaid Task & YouTube Review" Scheme
              </h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Students are invited to a Telegram channel and given simple tasks (liking YouTube videos, reviewing hotels) for small ₹150 payouts. Soon, they are invited to "Prepaid VIP tasks" requiring ₹5,000 or ₹15,000 deposits to unlock higher returns. The money is stolen and accounts blocked.
              </p>
            </div>

            {/* Scam 3 */}
            <div className="border border-neutral-border rounded-lg p-4 bg-warm">
              <span className="text-[11px] font-semibold text-danger uppercase tracking-wider block mb-1">Scam Type #3</span>
              <h5 className="font-semibold text-charcoal mb-1 text-sm">
                The Data Entry "Breach of Contract & Legal Notice" Extortion
              </h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Students sign an online agreement for work-from-home "typing/form-filling". Scammers then claim errors were made, declare breach of contract, and send forged legal notices threatening police action unless the student pays a ₹10,000 "settlement fine".
                <span className="block mt-1 font-semibold text-danger">Fact: These fabricated threats have zero legal validity. Do not pay.</span>
              </p>
            </div>

            {/* Scam 4 */}
            <div className="border border-neutral-border rounded-lg p-4 bg-warm">
              <span className="text-[11px] font-semibold text-warning uppercase tracking-wider block mb-1">Scam Type #4</span>
              <h5 className="font-semibold text-charcoal mb-1 text-sm">
                Lookalike Domains & Brand Impersonation
              </h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Scammers register domains such as <code className="bg-surface px-1.5 py-0.5 rounded border border-neutral-border font-mono text-charcoal">tcs-careers-india.com</code> or <code className="bg-surface px-1.5 py-0.5 rounded border border-neutral-border font-mono text-charcoal">infosys-hire.in</code> or use free Gmail IDs (<code className="bg-surface px-1.5 py-0.5 rounded border border-neutral-border font-mono text-charcoal">hr.tataconsultancy@gmail.com</code>) to impersonate genuine firms.
              </p>
            </div>

            {/* Scam 5 */}
            <div className="border border-neutral-border rounded-lg p-4 bg-warm">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">Scam Type #5</span>
              <h5 className="font-semibold text-charcoal mb-1 text-sm">
                The Paid "Internship + Mandatory Training Course" Upsell
              </h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Commercial institutes disguise courses as internships. After an interview, they state: "You are selected for our internship, but must complete our mandatory ₹12,000 certification program first." This is course marketing, not an employment offer.
              </p>
            </div>
          </div>

          {/* Official Emergency Contacts in India */}
          <div className="bg-warm border border-neutral-border rounded-lg p-5 space-y-3">
            <h4 className="font-semibold text-charcoal text-sm flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-danger" />
              <span>Official Indian Cybercrime Helplines</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-surface p-3 rounded-md border border-danger-border">
                <p className="text-danger font-semibold text-base">Call 1930</p>
                <p className="text-muted mt-0.5">National Cyber Crime Reporting Toll-Free Helpline (MHA)</p>
              </div>
              <div className="bg-surface p-3 rounded-md border border-neutral-border">
                <p className="text-forest font-semibold text-base">cybercrime.gov.in</p>
                <p className="text-muted mt-0.5">National Cyber Crime Reporting Portal for formal complaints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-warm px-6 py-3.5 border-t border-neutral-border flex justify-end">
          <button
            onClick={onClose}
            className="bg-forest hover:bg-forest-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
