export type DocumentChunk = {
  id: string;
  text: string;
  source: string;
  page?: number;
  embedding: number[];
};

export type RetrievedChunk = {
  id: string;
  text: string;
  source: string;
  page?: number;
  score: number;
};

export type ChatResponse = {
  answer: string;
  sources: RetrievedChunk[];
};
