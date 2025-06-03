import type { FileMetadata } from "../types/index";
import ExifReader from "exifreader";

export const extractImageMetadata = async (
  file: File
): Promise<FileMetadata> => {
  const metadata: FileMetadata = {};

  try {
    metadata["Nome do arquivo"] = file.name;
    metadata["Tamanho"] = `${(file.size / 1024).toFixed(2)} KB`;
    metadata["Tipo MIME"] = file.type;
    metadata["Data de modificação"] = new Date(
      file.lastModified
    ).toLocaleString("pt-BR");

    const img = new Image();
    const imageLoaded = new Promise<void>((resolve) => {
      img.onload = () => {
        metadata["Largura"] = `${img.width}px`;
        metadata["Altura"] = `${img.height}px`;
        metadata["Dimensões"] = `${img.width}x${img.height}`;
        resolve();
      };
      img.onerror = () => resolve();
    });

    img.src = URL.createObjectURL(file);
    await imageLoaded;

    const arrayBuffer = await file.arrayBuffer();
    const exifData = ExifReader.load(arrayBuffer);

    const exifMappings = {
      Make: "Fabricante da câmera",
      Model: "Modelo da câmera",
      Software: "Software",
      DateTime: "Data/Hora da foto",
      DateTimeOriginal: "Data original",
      DateTimeDigitized: "Data digitalizada",
      Artist: "Artista/Autor",
      Copyright: "Copyright",
      ImageDescription: "Descrição da imagem",
      Orientation: "Orientação",
      XResolution: "Resolução X",
      YResolution: "Resolução Y",
      WhiteBalance: "Balanço de branco",
      Flash: "Flash",
      FNumber: "Abertura (f)",
      ExposureTime: "Tempo de exposição",
      ISO: "ISO",
      FocalLength: "Distância focal",
      ColorSpace: "Espaço de cor",
      ExifImageWidth: "Largura EXIF",
      ExifImageHeight: "Altura EXIF",
    };

    const gpsInfo = {
      GPSLatitudeRef: "GPS Referência Latitude",
      GPSLatitude: "GPS Latitude",
      GPSLongitudeRef: "GPS Referência Longitude",
      GPSLongitude: "GPS Longitude",
      GPSAltitudeRef: "GPS Referência Altitude",
      GPSAltitude: "GPS Altitude",
      GPSTimeStamp: "GPS Timestamp",
      GPSDateStamp: "GPS Data",
    };

    Object.entries(exifMappings).forEach(([exifKey, displayName]) => {
      if (exifData[exifKey]?.description) {
        metadata[displayName] = exifData[exifKey].description;
      }
    });

    Object.entries(gpsInfo).forEach(([gpsKey, displayName]) => {
      if (exifData[gpsKey]?.description) {
        metadata[displayName] = exifData[gpsKey].description;
      }
    });

    if (exifData.GPSLatitude && exifData.GPSLongitude) {
      const lat = exifData.GPSLatitude.description;
      const lng = exifData.GPSLongitude.description;
      const latRef = exifData.GPSLatitudeRef?.description || "";
      const lngRef = exifData.GPSLongitudeRef?.description || "";

      if (lat && lng) {
        metadata["Coordenadas GPS"] = `${lat}${latRef}, ${lng}${lngRef}`;
      }
    }

    if (exifData.Thumbnail) {
      metadata["Thumbnail"] = "Presente";
    }

    return metadata;
  } catch (error) {
    console.error("Erro ao extrair metadados EXIF:", error);

    return {
      "Nome do arquivo": file.name,
      Tamanho: `${(file.size / 1024).toFixed(2)} KB`,
      "Tipo MIME": file.type,
      "Data de modificação": new Date(file.lastModified).toLocaleString(
        "pt-BR"
      ),
    };
  }
};

export const extractPdfMetadata = async (file: File): Promise<FileMetadata> => {
  const metadata: FileMetadata = {};

  try {
    metadata["Nome do arquivo"] = file.name;
    metadata["Tamanho"] = `${(file.size / 1024).toFixed(2)} KB`;
    metadata["Tipo MIME"] = file.type;
    metadata["Data de modificação"] = new Date(
      file.lastModified
    ).toLocaleString("pt-BR");

    const arrayBuffer = await file.arrayBuffer();
    const { PDFDocument } = await import("pdf-lib");

    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      metadata["Número de páginas"] = pageCount.toString();

      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const subject = pdfDoc.getSubject();
      const keywords = pdfDoc.getKeywords();
      const creator = pdfDoc.getCreator();
      const producer = pdfDoc.getProducer();
      const creationDate = pdfDoc.getCreationDate();
      const modificationDate = pdfDoc.getModificationDate();

      if (title) metadata["Título"] = title;
      if (author) metadata["Autor"] = author;
      if (subject) metadata["Assunto"] = subject;
      if (keywords) metadata["Palavras-chave"] = keywords;
      if (creator) metadata["Criador"] = creator;
      if (producer) metadata["Produtor"] = producer;
      if (creationDate)
        metadata["Data de criação"] = creationDate.toLocaleString("pt-BR");
      if (modificationDate)
        metadata["Data de modificação PDF"] =
          modificationDate.toLocaleString("pt-BR");
    } catch (pdfError) {
      console.error("Erro ao processar PDF:", pdfError);
      metadata["Erro"] =
        "Não foi possível processar o PDF (pode estar criptografado ou corrompido)";
    }

    return metadata;
  } catch (error) {
    console.error("Erro ao extrair metadados do PDF:", error);

    return {
      "Nome do arquivo": file.name,
      Tamanho: `${(file.size / 1024).toFixed(2)} KB`,
      "Tipo MIME": file.type,
      "Data de modificação": new Date(file.lastModified).toLocaleString(
        "pt-BR"
      ),
      Erro: "Erro ao processar arquivo PDF",
    };
  }
};

export const extractGenericMetadata = async (
  file: File
): Promise<FileMetadata> => {
  return Promise.resolve({
    "Nome do arquivo": file.name,
    Tamanho: `${(file.size / 1024).toFixed(2)} KB`,
    "Tipo MIME": file.type,
    "Data de modificação": new Date(file.lastModified).toLocaleString("pt-BR"),
  });
};
