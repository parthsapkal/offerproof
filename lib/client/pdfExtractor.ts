/**
 * Client-side safe text extractor for PDF documents.
 * Extracts pure text layers without executing any embedded scripts or macros.
 * Does not store or upload files anywhere.
 */

export async function extractTextFromPdf(file: File): Promise<{ text: string; pageCount: number; error?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamically load pdfjs-dist in browser
    const pdfjs = await import('pdfjs-dist');

    // Configure worker source to CDN matching pdfjs version for clean client-side execution
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
    }

    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false, // Security: disable eval
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = '';

    const maxPagesToRead = Math.min(pageCount, 10); // Read up to first 10 pages for offer letters
    for (let i = 1; i <= maxPagesToRead; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return {
      text: fullText.trim(),
      pageCount,
    };
  } catch (err: unknown) {
    console.warn('PDF text extraction fallback triggered:', err);
    // Lightweight fallback text extraction from ASCII streams in raw PDF if worker/canvas fails
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let rawString = '';
      const limit = Math.min(uint8Array.length, 300000); // 300KB scan
      for (let i = 0; i < limit; i++) {
        const charCode = uint8Array[i];
        if (charCode >= 32 && charCode <= 126) {
          rawString += String.fromCharCode(charCode);
        } else if (charCode === 10 || charCode === 13) {
          rawString += ' ';
        }
      }

      // Filter common readable words
      const words = rawString.split(/\s+/).filter((w) => w.length > 2 && /^[a-zA-Z0-9@_.\-₹]+$/.test(w));
      const extractedFallback = words.slice(0, 1500).join(' ');

      if (extractedFallback.length > 100) {
        return {
          text: extractedFallback,
          pageCount: 1,
        };
      }
    } catch {
      // ignore
    }

    return {
      text: '',
      pageCount: 0,
      error: 'Unable to parse text layer from this PDF. Please copy and paste the offer text into the text area below.',
    };
  }
}
