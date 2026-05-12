import { redirect } from "next/navigation";

// /dashboard/settings redirects to account settings by default
export default function SettingsPage() {
  redirect("/dashboard/settings/account");
}
