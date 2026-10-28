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
          setProcessingStatus(`Successfully parsed ${result.pageCount} page(s) (~${result.text.split(/\s+/).length} words).`);
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
      } catch (err: unknown) {
        setIsProcessing(false);
        setErrorMsg('Failed to read PDF text. Please copy and paste the offer text directly into the text field.');
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
        'Image / Screenshot Uploaded: Client-side OCR is not active in this lightweight tier to prevent external AI data transmission. Please paste the offer text from your screenshot into the "Pasted Offer Text" box below for comprehensive analysis.'
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-navy-900">
          Upload Offer Letter or Email Screenshot (Optional)
        </label>
        <span className="text-xs text-navy-500">PDF, PNG, JPG (Max 5MB)</span>
      </div>

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-teal-500 bg-teal-50/60'
              : 'border-navy-300 hover:border-navy-400 bg-navy-50/40 hover:bg-navy-50/70'
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

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-700">
              <UploadCloud className="w-6 h-6 text-navy-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">
                Click to browse or drag & drop document
              </p>
              <p className="text-xs text-navy-500 mt-0.5">
                PDF text extracted safely in browser. No files stored or sent to external AI.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-navy-200 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700 shrink-0">
                {selectedFile.type === 'application/pdf' ? (
                  <FileText className="w-5 h-5 text-red-600" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-teal-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-900 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-navy-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull;{' '}
                  {selectedFile.type === 'application/pdf' ? 'PDF Document' : 'Image Screenshot'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="text-navy-400 hover:text-red-600 p-1 rounded-lg hover:bg-navy-50 transition"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-3 flex items-center space-x-2 text-xs text-teal-700 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>{processingStatus || 'Analyzing document...'}</span>
            </div>
          )}

          {!isProcessing && processingStatus && (
            <div className="mt-3 flex items-center space-x-2 text-xs text-teal-800 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{processingStatus}</span>
            </div>
          )}

          {/* OCR Fallback Notice for Images */}
          {ocrNotice && (
            <div className="mt-3 text-xs bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">OCR Unavailable in Lightweight Tier</p>
                <p className="text-amber-800 leading-relaxed">{ocrNotice}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="flex items-center space-x-1.5 text-[11px] text-navy-500 pt-1">
        <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        <span>Document privacy: parsed locally in browser memory. Never uploaded to servers or stored.</span>
      </div>
    </div>
  );
}
