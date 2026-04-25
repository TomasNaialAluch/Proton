export interface Contract {
  id: string;
  release: string;
  label: string;
  labelSlug: string;
  signedAt: string;
  status: "signed" | "pending" | "expired";
  documentUrl: string | null;
}
