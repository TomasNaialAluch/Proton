import type { LabelManagerProfile } from "@/types/labelManagerProfile";
import { LABEL_MANAGER_LABEL_ID } from "@/lib/store/label-manager/labelScopeStore";

/** The one label-manager identity in this prototype — manages Toxic Astronaut. */
export const mockLabelManagerProfile: LabelManagerProfile = {
  id: "toxic-astronaut-manager-1",
  name: "Alex Rivera",
  role: "manager",
  labelId: LABEL_MANAGER_LABEL_ID,
};
