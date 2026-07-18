/**
 * The logged-in person on the label-manager side — mirrors what `Artist`
 * (`mockArtist`, "Naial") is for the producer side: a single identity the
 * UI is built around, not just an abstract "label" entity.
 *
 * `role` is intentionally its own field, not folded into `name` — this is
 * where future hierarchy/permissions would hang (e.g. an Owner can invite
 * other roles, an A&R can scout but not edit demo policy, etc.). Only one
 * role exists in the mock today; the type leaves room to grow rather than
 * assuming a single flat "label manager" account forever.
 */
export type LabelManagerRole = "owner" | "manager" | "ar";

export const LABEL_MANAGER_ROLE_LABEL: Record<LabelManagerRole, string> = {
  owner: "Owner",
  manager: "Label Manager",
  ar: "A&R",
};

export interface LabelManagerProfile {
  id: string;
  name: string;
  role: LabelManagerRole;
  /** Which label this person manages — ties to `ProtonLabel.id`. */
  labelId: string;
}
