'use client';

import React from 'react';
import { X, ShieldAlert, PhoneCall, ExternalLink, CheckCircle, AlertTriangle, BookOpen, Building2 } from 'lucide-react';

interface IndiaScamGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndiaScamGuideModal({ isOpen, onClose }: IndiaScamGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-navy-200 overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-navy-950 px-6 py-5 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Student Safety Guide: Indian Internship Scams
              </h3>
              <p className="text-xs text-navy-300">
                AICTE warnings, red flags, and legal guidance for Indian college students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-navy-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-navy-900 text-sm">
          {/* Key Rule: Zero Fee Rule */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-950">
            <div className="flex items-center space-x-2 mb-1.5 font-black text-red-800 uppercase tracking-wider text-xs">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>The Cardinal Rule of Indian Internships</span>
            </div>
            <p className="text-sm font-bold">
              Legitimate employers in India NEVER ask you to pay ANY money.
            </p>
            <p className="text-xs text-red-900 mt-1 leading-relaxed">
              Whether called an "application fee", "refundable laptop deposit", "document verification charge", or "training kit cost", any request for money before or during an internship is fraudulent.
            </p>
          </div>

          {/* Top 5 Common Scams in India */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-navy-950 text-base uppercase tracking-wider border-b pb-1 text-xs">
              Top 5 Scam Archetypes Targeting Indian Students
            </h4>

            {/* Scam 1 */}
            <div className="border border-navy-200 rounded-xl p-4 bg-navy-50/40">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Scam Type #1</span>
              <h5 className="font-bold text-navy-950 mb-1">
                The "Upfront Registration & Laptop Courier" Trap
              </h5>
              <p className="text-xs text-navy-700 leading-relaxed">
                Fraudsters send a polished offer letter with a high stipend (e.g. \u20B930,000/mo) and claim a high-end company laptop is being dispatched. They demand \u20B92,000–\u20B95,000 as a "courier clearance" or "asset security deposit", promising reimbursement on joining day. Once paid via UPI, the recruiter vanishes.
              </p>
            </div>

            {/* Scam 2 */}
            <div className="border border-navy-200 rounded-xl p-4 bg-navy-50/40">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Scam Type #2</span>
              <h5 className="font-bold text-navy-950 mb-1">
                The Telegram "Prepaid Task & YouTube Review" Scheme
              </h5>
              <p className="text-xs text-navy-700 leading-relaxed">
                Students are invited to a Telegram channel and given simple tasks (liking YouTube videos, reviewing hotels on Google Maps) for small \u20B9150 payouts. Soon, they are invited to "Prepaid VIP tasks" requiring them to deposit \u20B95,000 or \u20B915,000 to unlock higher returns. The money is stolen and accounts are blocked.
              </p>
            </div>

            {/* Scam 3 */}
            <div className="border border-navy-200 rounded-xl p-4 bg-navy-50/40">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Scam Type #3</span>
              <h5 className="font-bold text-navy-950 mb-1">
                The Data Entry "Breach of Contract & Police Notice" Extortion
              </h5>
              <p className="text-xs text-navy-700 leading-relaxed">
                Students sign an online agreement for work-from-home "typing/form-filling". Scammers then claim errors were made, declare breach of contract, and send forged legal notices threatening police FIR under IPC sections unless the student pays a \u20B910,000 "settlement fine".
                <strong className="block mt-1 text-red-800">Fact: These legal threats have zero legal validity. Do not pay.</strong>
              </p>
            </div>

            {/* Scam 4 */}
            <div className="border border-navy-200 rounded-xl p-4 bg-navy-50/40">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Scam Type #4</span>
              <h5 className="font-bold text-navy-950 mb-1">
                Lookalike Domains & Brand Impersonation
              </h5>
              <p className="text-xs text-navy-700 leading-relaxed">
                Scammers register domains such as <code className="bg-navy-100 px-1 py-0.5 rounded text-navy-900">tcs-careers-india.com</code> or <code className="bg-navy-100 px-1 py-0.5 rounded text-navy-900">infosys-hire.in</code> or use free Gmail IDs (<code className="bg-navy-100 px-1 py-0.5 rounded text-navy-900">hr.tataconsultancy@gmail.com</code>). They conduct mock telephonic rounds to collect Aadhaar and PAN cards for identity theft.
              </p>
            </div>

            {/* Scam 5 */}
            <div className="border border-navy-200 rounded-xl p-4 bg-navy-50/40">
              <span className="text-[10px] font-bold text-navy-600 uppercase tracking-widest block mb-1">Scam Type #5</span>
              <h5 className="font-bold text-navy-950 mb-1">
                The Paid "Internship + Training Course" Upsell
              </h5>
              <p className="text-xs text-navy-700 leading-relaxed">
                Companies disguise training institutes as recruitment agencies. After a superficial interview, they tell you: "You are selected for our internship, but you must first complete our mandatory \u20B912,000 certification program." This is commercial course selling, not an internship.
              </p>
            </div>
          </div>

          {/* Official Emergency Contacts in India */}
          <div className="bg-navy-900 text-white rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-red-400" />
              <span>Official Indian Cybercrime Helplines</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-navy-800/80 p-3 rounded-lg border border-navy-700">
                <p className="text-red-400 font-bold text-base">Call 1930</p>
                <p className="text-navy-300 mt-0.5">National Cyber Crime Reporting Toll-Free Helpline (MHA)</p>
              </div>
              <div className="bg-navy-800/80 p-3 rounded-lg border border-navy-700">
                <p className="text-teal-400 font-bold text-base">cybercrime.gov.in</p>
                <p className="text-navy-300 mt-0.5">National Cyber Crime Reporting Portal for formal complaints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-navy-50 px-6 py-4 border-t border-navy-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
