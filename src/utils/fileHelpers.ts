export const getSensitiveMetadataKeys = (): string[] => {
  return [
    "GPS Latitude",
    "GPS Longitude",
    "GPS Referência Latitude",
    "GPS Referência Longitude",
    "GPS Altitude",
    "GPS Timestamp",
    "GPS Data",
    "Coordenadas GPS",

    "Fabricante da câmera",
    "Modelo da câmera",
    "Software",

    "Artista/Autor",
    "Autor",
    "Copyright",
    "Criador",
    "Produtor",

    "Data/Hora da foto",
    "Data original",
    "Data digitalizada",
    "Data de criação",
    "Data de modificação PDF",

    "Título",
    "Assunto",
    "Palavras-chave",
    "Descrição da imagem",

    "Thumbnail",
  ];
};

export const downloadFile = (file: File): void => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

export const isSupportedFile = (file: File): boolean => {
  return isImageFile(file) || isPdfFile(file);
};

export const generateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const generateSanitizationCertificate = (
  originalFileName: string,
  originalHash: string,
  sanitizedHash: string,
  removedMetadata: string[]
) => {
  const timestamp = new Date().toISOString();
  const certificateId = `CERT-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return {
    id: certificateId,
    timestamp,
    originalFileName,
    originalHash,
    sanitizedHash,
    removedMetadata,
    operation: "METADATA_SANITIZATION" as const,
    status: "VERIFIED" as const,
  };
};

export const downloadCertificate = (certificate: any): void => {
  const certData = JSON.stringify(certificate, null, 2);
  const blob = new Blob([certData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `certificado_sanitizacao_${certificate.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
