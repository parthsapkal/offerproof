'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SampleCases } from '@/components/SampleCases';
import { VerificationForm } from '@/components/VerificationForm';
import { ResultsReport } from '@/components/ResultsReport';
import { IndiaScamGuideModal } from '@/components/IndiaScamGuideModal';
import { Footer } from '@/components/Footer';
import { OfferInput, SampleCase, VerificationReport } from '@/lib/types';
import { AlertCircle, ShieldCheck, CheckCircle2, FileSearch } from 'lucide-react';

export default function HomePage() {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [formData, setFormData] = useState<OfferInput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const samplesSectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSamples = () => {
    samplesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerify = async (input: OfferInput) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server error occurred during verification.');
      }

      setReport(data.report);
      setFormData(input);

      // Smooth scroll to results after a brief render delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to verification engine.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleCase, autoRun: boolean = true) => {
    setFormData(sample.input);
    if (autoRun) {
      handleVerify(sample.input);
    } else {
      scrollToForm();
    }
  };

  const handleReset = () => {
    setReport(null);
    setFormData(null);
    setApiError(null);
    scrollToForm();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Navigation Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onScrollToForm={scrollToForm}
        onScrollToSamples={scrollToSamples}
      />

      {/* Hero Section */}
      <Hero
        onScrollToForm={scrollToForm}
        onScrollToSamples={scrollToSamples}
      />

      {/* Judge & Evaluator Sample Cases */}
      <div ref={samplesSectionRef}>
        <SampleCases
          onSelectCase={handleSelectSample}
          isLoading={isLoading}
        />
      </div>

      {/* Main Interactive Workspace Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* API Error Notification */}
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Verification Error</p>
              <p className="text-red-800">{apiError}</p>
            </div>
          </div>
        )}

        {/* If Report exists, show Results with option to toggle form */}
        {report ? (
          <div ref={resultsRef} className="space-y-8">
            <ResultsReport report={report} onReset={handleReset} />
          </div>
        ) : (
          <div ref={formSectionRef} className="max-w-4xl mx-auto">
            <VerificationForm
              onSubmit={handleVerify}
              isLoading={isLoading}
              initialData={formData}
              onSelectSample={(sample) => handleSelectSample(sample, false)}
            />
          </div>
        )}
      </main>

      {/* Educational Scam Guide Modal */}
      <IndiaScamGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenGuide={() => setIsGuideOpen(true)}
        onScrollToTop={scrollToTop}
      />
    </div>
  );
}
