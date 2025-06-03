export interface MetadataEntry {
  key: string;
  value: string;
  isSensitive: boolean;
}

export interface FileMetadata {
  [key: string]: string;
}

export interface ProcessingState {
  isUploading: boolean;
  isAnalyzing: boolean;
  isSanitizing: boolean;
  isComplete: boolean;
}

export type TabType = "upload" | "analyze" | "sanitize";

export interface SanitizedFileResult {
  file: File;
  originalSize: number;
  sanitizedSize: number;
  removedMetadataCount: number;
  originalHash: string;
  sanitizedHash: string;
  certificate: SanitizationCertificate;
}

export interface SanitizationCertificate {
  id: string;
  timestamp: string;
  originalFileName: string;
  originalHash: string;
  sanitizedHash: string;
  removedMetadata: string[];
  operation: "METADATA_SANITIZATION";
  status: "VERIFIED";
}
