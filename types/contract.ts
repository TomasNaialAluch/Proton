export interface Contract {
  id: string;
  artistId: string;
  title: string;
  status: "pending" | "signed" | "expired";
  createdAt: string;
  signedAt: string | null;
  expiresAt: string;
  documentUrl: string;
}
