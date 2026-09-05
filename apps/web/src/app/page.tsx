import { redirect } from "next/navigation";

// proxy.ts already sends signed-out requests to /login, so by the time this
// renders the visitor is authenticated. Redirects to /style-guide as a
// placeholder until Phase 12 builds the real Dashboard.
export default function RootPage() {
  redirect("/style-guide");
}
