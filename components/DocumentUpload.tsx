'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, Loader2, Shield } from 'lucide-react';
import { extractTextFromPdf } from '@/lib/client/pdfExtractor';

interface DocumentUploadProps {
  onDocumentProcessed: (doc: {
    fileName: string;
    fileType: string;
    extractedText: string;
    fileSize: number;
  } | null) => void;
  onTextAppendedToForm?: (extractedText: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export function DocumentUpload({ onDocumentProcessed, onTextAppendedToForm }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ocrNotice, setOcrNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setOcrNotice(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Unsupported file type. Please upload a PDF, PNG, or JPG file.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File exceeds the 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller document.`);
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    if (file.type === 'application/pdf') {
      setProcessingStatus('Extracting text layer from PDF document in browser...');
      try {
        const result = await extractTextFromPdf(file);
        setIsProcessing(false);

        if (result.error && !result.text) {
          setErrorMsg(result.error);
          onDocumentProcessed({
            fileName: file.name,
            fileType: file.type,
            extractedText: '',
            fileSize: file.size,
          });
        } else {
          setProcessingStatus(`Extracted ${result.pageCount} page(s) (~${result.text.split(/\s+/).length} words).`);
          onDocumentProcessed({
            fileName: file.name,
            fileType: file.type,
            extractedText: result.text,
            fileSize: file.size,
          });
          if (onTextAppendedToForm && result.text) {
            onTextAppendedToForm(result.text);
          }
        }
      } catch {
        setIsProcessing(false);
        setErrorMsg('Failed to parse PDF text. Please copy and paste the offer text into the text area below.');
        onDocumentProcessed({
          fileName: file.name,
          fileType: file.type,
          extractedText: '',
          fileSize: file.size,
        });
      }
    } else {
      // Image file (PNG / JPG)
      setIsProcessing(false);
      setProcessingStatus(null);
      setOcrNotice(
        'Image Screenshot Uploaded: Client-side OCR is unavailable in this lightweight tier to protect data privacy. Please review the image and copy/paste key offer terms into the text box below for analysis.'
      );
      onDocumentProcessed({
        fileName: file.name,
        fileType: file.type,
        extractedText: '',
        fileSize: file.size,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setProcessingStatus(null);
    setErrorMsg(null);
    setOcrNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onDocumentProcessed(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-charcoal">
          Upload Offer Letter or Email Screenshot (Optional)
        </label>
        <span className="text-[11px] text-muted">PDF, PNG, JPG (Max 5MB)</span>
      </div>

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded p-5 text-center cursor-pointer transition ${
            dragActive
              ? 'border-forest bg-sage/50'
              : 'border-neutral-border hover:border-muted bg-warm hover:bg-neutral-subtle'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-1.5">
            <UploadCloud className="w-5 h-5 text-muted" />
            <p className="text-xs font-medium text-charcoal">
              Click to browse or drag and drop document
            </p>
            <p className="text-[11px] text-muted">
              PDF text parsed locally in browser memory. No files stored or transmitted to external AI services.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-border bg-surface rounded p-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-warm border border-neutral-border flex items-center justify-center text-muted shrink-0">
                {selectedFile.type === 'application/pdf' ? (
                  <FileText className="w-4 h-4 text-charcoal" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-charcoal" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-charcoal truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-muted">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull;{' '}
                  {selectedFile.type === 'application/pdf' ? 'PDF Document' : 'Image Screenshot'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="text-muted hover:text-danger-text p-1 rounded hover:bg-warm transition"
              title="Remove file"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-2.5 flex items-center space-x-2 text-xs text-muted bg-warm px-2.5 py-1.5 rounded border border-neutral-border">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted" />
              <span>{processingStatus || 'Analyzing document...'}</span>
            </div>
          )}

          {!isProcessing && processingStatus && (
            <div className="mt-2.5 flex items-center space-x-2 text-xs text-forest bg-sage px-2.5 py-1.5 rounded border border-sage-border">
              <CheckCircle className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>{processingStatus}</span>
            </div>
          )}

          {/* OCR Fallback Notice */}
          {ocrNotice && (
            <div className="mt-2.5 text-xs bg-warning-bg border border-warning-border text-warning-text p-2.5 rounded flex items-start space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-warning-text shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p className="font-semibold text-charcoal mb-0.5">OCR Unavailable in Lightweight Tier</p>
                <p className="text-muted text-[11px]">{ocrNotice}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="text-xs text-danger-text bg-danger-bg border border-danger-border p-2.5 rounded flex items-center space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-danger-text shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center space-x-1.5 text-[11px] text-muted pt-0.5">
        <Shield className="w-3 h-3 text-muted shrink-0" />
        <span>Document privacy: parsed locally in browser memory. Never uploaded or stored on servers.</span>
      </div>
    </div>
  );
}
