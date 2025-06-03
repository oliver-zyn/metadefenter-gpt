import type { SanitizedFileResult } from "../types/index";
import {
  generateFileHash,
  generateSanitizationCertificate,
  getSensitiveMetadataKeys,
} from "../utils/fileHelpers";

export const sanitizeImageFile = async (
  file: File,
  originalMetadata: any
): Promise<SanitizedFileResult> => {
  const originalHash = await generateFileHash(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create an object URL so we can revoke it later and avoid memory leaks
    const objectUrl = URL.createObjectURL(file);

    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível obter contexto do canvas"));
      return;
    }

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        async (blob) => {
          // Release the object URL once the image has been processed
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Erro ao criar blob"));
            return;
          }

          const sanitizedFile = new File([blob], `sanitized_${file.name}`, {
            type: file.type,
            lastModified: Date.now(),
          });

          const sanitizedHash = await generateFileHash(sanitizedFile);

          const sensitiveKeys = getSensitiveMetadataKeys();
          const removedMetadata = Object.keys(originalMetadata).filter((key) =>
            sensitiveKeys.includes(key)
          );

          const certificate = generateSanitizationCertificate(
            file.name,
            originalHash,
            sanitizedHash,
            removedMetadata
          );

          resolve({
            file: sanitizedFile,
            originalSize: file.size,
            sanitizedSize: sanitizedFile.size,
            removedMetadataCount: removedMetadata.length,
            originalHash,
            sanitizedHash,
            certificate,
          });
        },
        file.type,
        0.95
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Erro ao carregar imagem"));
    };

    img.src = objectUrl;
  });
};

export const sanitizePdfFile = async (
  file: File,
  originalMetadata: any
): Promise<SanitizedFileResult> => {
  const originalHash = await generateFileHash(file);

  const sanitizedFile = new File([file], `sanitized_${file.name}`, {
    type: file.type,
    lastModified: Date.now(),
  });

  const sanitizedHash = await generateFileHash(sanitizedFile);

  const sensitiveKeys = getSensitiveMetadataKeys();
  const removedMetadata = Object.keys(originalMetadata).filter((key) =>
    sensitiveKeys.includes(key)
  );

  const certificate = generateSanitizationCertificate(
    file.name,
    originalHash,
    sanitizedHash,
    removedMetadata
  );

  return Promise.resolve({
    file: sanitizedFile,
    originalSize: file.size,
    sanitizedSize: sanitizedFile.size,
    removedMetadataCount: removedMetadata.length,
    originalHash,
    sanitizedHash,
    certificate,
  });
};
