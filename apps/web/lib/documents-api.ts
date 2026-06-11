import { api } from "./api";

export interface DocumentItem {
  id: string;
  name: string;
  type?: string;
  size: number;
  sourceUrl?: string;
  createdAt?: string;
}

export interface DocumentStats {
  total: number;
  external: number;
  recent: number;
}

export interface CreateDocumentInput {
  name: string;
  type?: string;
  size?: number;
  dataUrl?: string;
  sourceUrl?: string;
}

export const documentsApi = {
  async list(): Promise<DocumentItem[]> {
    const res = await api.get<DocumentItem[]>("/documents");
    return res.data;
  },
  async stats(): Promise<DocumentStats> {
    const res = await api.get<DocumentStats>("/documents/stats");
    return res.data;
  },
  async create(input: CreateDocumentInput): Promise<DocumentItem> {
    const res = await api.post<DocumentItem>("/documents", input);
    return res.data;
  },
  async remove(id: string): Promise<void> {
    await api.del(`/documents/${id}`);
  },
  async content(id: string): Promise<string | null> {
    const res = await api.get<{ content: string | null }>(
      `/documents/${id}/content`,
    );
    return res.data.content;
  },
};

/** Read a File as a base64 data URL. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
