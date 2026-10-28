import { NextResponse } from 'next/server';
import { OfferInput } from '@/lib/types';
import { runVerificationEngine } from '@/lib/engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request payload. Expected JSON object.' },
        { status: 400 }
      );
    }

    // Required fields check
    const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : '';
    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company Name is required for verification.' },
        { status: 422 }
      );
    }

    // Sanitize and normalize input
    const input: OfferInput = {
      companyName,
      companyWebsite: typeof body.companyWebsite === 'string' ? body.companyWebsite.trim() : '',
      recruiterName: typeof body.recruiterName === 'string' ? body.recruiterName.trim() : '',
      recruiterEmail: typeof body.recruiterEmail === 'string' ? body.recruiterEmail.trim() : '',
      jobTitle: typeof body.jobTitle === 'string' ? body.jobTitle.trim() : '',
      jobListingUrl: typeof body.jobListingUrl === 'string' ? body.jobListingUrl.trim() : '',
      offerSource: typeof body.offerSource === 'string' ? body.offerSource.trim() : 'other',
      feeRequested: Boolean(body.feeRequested),
      feeAmount: typeof body.feeAmount === 'number' ? body.feeAmount : body.feeAmount ? Number(body.feeAmount) || null : null,
      feeReason: typeof body.feeReason === 'string' ? body.feeReason.trim() : '',
      pastedText: typeof body.pastedText === 'string' ? body.pastedText.trim() : '',
      documentFileName: typeof body.documentFileName === 'string' ? body.documentFileName.trim() : undefined,
      documentFileType: typeof body.documentFileType === 'string' ? body.documentFileType.trim() : undefined,
      documentExtractedText: typeof body.documentExtractedText === 'string' ? body.documentExtractedText.trim() : undefined,
      // Extended fields for Official Listing Match
      jobId: typeof body.jobId === 'string' ? body.jobId.trim() : undefined,
      location: typeof body.location === 'string' ? body.location.trim() : undefined,
      compensation: typeof body.compensation === 'string' ? body.compensation.trim() : undefined,
      duration: typeof body.duration === 'string' ? body.duration.trim() : undefined,
      applicationDeadline: typeof body.applicationDeadline === 'string' ? body.applicationDeadline.trim() : undefined,
      demoScenarioId: typeof body.demoScenarioId === 'string' ? body.demoScenarioId.trim() : undefined,
    };

    // Execute deterministic verification engine (async with listing matcher)
    const report = await runVerificationEngine(input);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal verification engine failure';
    console.error('Verification Engine API Error:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
